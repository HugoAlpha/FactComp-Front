import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

interface ModalContingency2Props {
    isOpen: boolean;
    onClose: () => void;
    evento: { codigoClasificador: string; descripcion: string } | undefined;
    
}

const ModalContingency2: React.FC<ModalContingency2Props> = ({ isOpen, onClose, evento }) => {
    const [fechaHoraInicio, setFechaHoraInicio] = useState<Date | null>(null);
    const [fechaHoraFin, setFechaHoraFin] = useState<Date | null>(null);

    const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleConfirm = async () => {
        if (!fechaHoraInicio || !fechaHoraFin || fechaHoraFin < fechaHoraInicio) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.',
            });
            return;
        }

        const formattedInicio = formatDateTime(fechaHoraInicio);
        const formattedFin = formatDateTime(fechaHoraFin);

        localStorage.setItem('fechaHoraInicio', formattedInicio);
        localStorage.setItem('fechaHoraFin', formattedFin);

        const idPuntoVenta = localStorage.getItem('idPOS');
        const idSucursal = localStorage.getItem('idSucursal');

        const body = {
            idPuntoVenta: parseInt(idPuntoVenta || '0', 10),
            idSucursal: parseInt(idSucursal || '0', 10),
            codigoEvento: parseInt(evento?.codigoClasificador || '0', 10),
            descripcion: evento?.descripcion,
            fechaHoraInicio: formattedInicio,
            fechaHoraFin: formattedFin,
        };

        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/registrar-inicio-fin-evento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();


            if (response.ok && data.codigo && data.idEvento && data.mensaje?.includes("Evento registrado con exito")) {
                localStorage.setItem('idEvento', data.idEvento.toString());

                Swal.fire({
                    icon: 'success',
                    title: 'Modo contingencia Activado',
                    text: data.mensaje,
                    confirmButtonText: 'Aceptar',
                });
                onClose();

                const event = new CustomEvent('contingencyActivated');
                window.dispatchEvent(event);
            } else {
                Swal.fire('Error', 'Ocurrió un error al registrar el evento. Intente nuevamente.', 'error');
            }
        } catch (error) {
            console.error('Error al registrar evento de contingencia:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo activar el modo de contingencia. Intente nuevamente.',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white p-6 rounded-lg shadow-xl z-10 w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Empezar Evento Significativo</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Fecha y Hora de Inicio</label>
                    <DatePicker
                        selected={fechaHoraInicio}
                        onChange={(date) => setFechaHoraInicio(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="yyyy-MM-dd HH:mm"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Fecha y Hora de Fin</label>
                    <DatePicker
                        selected={fechaHoraFin}
                        onChange={(date) => setFechaHoraFin(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="yyyy-MM-dd HH:mm"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="w-1/2 bg-gray-300 text-gray-800 p-2 rounded-lg mr-2 hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="w-1/2 bg-firstColor text-white p-2 rounded-lg ml-2 hover:bg-principalColor"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalContingency2;
