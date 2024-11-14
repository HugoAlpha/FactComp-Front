import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ModalContingency2 from '../layouts/modalContingency2';

interface Evento {
    id: number;
    codigoClasificador: string;
    descripcion: string;
}

interface ModalContingencyProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (eventoDescripcion: string) => void;
}

const ModalContingency: React.FC<ModalContingencyProps> = ({ isOpen, onClose, onConfirm }) => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal2, setShowModal2] = useState(false);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/parametro/eventos-significativos`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data: Evento[] = await response.json();

                const sortedEventos = data.sort((a, b) => parseInt(a.codigoClasificador) - parseInt(b.codigoClasificador));
                setEventos(sortedEventos);
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError('No se pudieron cargar los eventos. Intente nuevamente más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    const handleConfirm = () => {
        const evento = eventos.find(e => e.descripcion === eventoSeleccionado);
        if (!evento) {
            alert('Por favor, selecciona un evento antes de continuar.');
            return;
        }

        if (parseInt(evento.codigoClasificador) <= 4) {
            registrarInicioEvento(evento.codigoClasificador, evento.descripcion);
        } else {
            setShowModal2(true);
        }
    };

    const registrarInicioEvento = async (codigoEvento: string, descripcion: string) => {
        const idPuntoVenta = localStorage.getItem('idPOS');
        const idSucursal = localStorage.getItem('idSucursal');

        const body = {
            idPuntoVenta: parseInt(idPuntoVenta, 10),
            idSucursal: parseInt(idSucursal, 10),
            codigoEvento: parseInt(codigoEvento, 10),
            descripcion: descripcion,
        };

        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/registrar-inicio-evento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('idEvento', data.idEvento.toString());

                Swal.fire({
                    title: 'Modo contingencia Activado',
                    text: 'Puede emitir facturas en modo contingencia por dos horas.',
                    confirmButtonText: 'Aceptar',
                });

                onConfirm(descripcion);
            } else {
                throw new Error('Error al registrar el inicio del evento');
            }
        } catch (error) {
            console.error('Error al registrar evento de contingencia:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo activar el modo de contingencia. Intente nuevamente.',
                icon: 'error',
            });
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
                <div className="bg-white p-6 rounded-lg shadow-xl z-10 w-96">
                    <h2 className="text-2xl font-bold text-center mb-4">Confirmar Modo de Contingencia</h2>
                    <p className="text-gray-700 text-center mb-6">
                        Selecciona un evento significativo para activar el modo de contingencia:
                    </p>

                    {loading ? (
                        <p className="text-center">Cargando eventos...</p>
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : (
                        <div className="relative">
                            <select
                                className="w-full max-w-xs p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-seventhColor truncate"
                                value={eventoSeleccionado}
                                onChange={(e) => setEventoSeleccionado(e.target.value)}
                            >
                                <option value="">-- Selecciona un evento --</option>
                                {eventos.map((evento) => (
                                    <option key={evento.id} value={evento.descripcion}>
                                        {evento.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handleClose}
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

            {showModal2 && (
                <ModalContingency2
                    isOpen={showModal2}
                    onClose={() => setShowModal2(false)}
                    evento={eventos.find(e => e.descripcion === eventoSeleccionado)}
                />
            )}
        </>
    );
};

export default ModalContingency;
