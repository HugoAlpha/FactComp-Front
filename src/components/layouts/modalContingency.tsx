import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Evento {
    id: number;
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

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/parametro/eventos-significativos`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data: Evento[] = await response.json();
                setEventos(data);
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
        if (!eventoSeleccionado) {
            alert('Por favor, selecciona un evento antes de continuar.');
            return;
        }
        const activationEvent = new CustomEvent('contingencyActivated');
        window.dispatchEvent(activationEvent);
        onConfirm(eventoSeleccionado);

        Swal.fire({
            title: 'Modo contingencia Activado',
            text: 'Puede emitir facturas en modo contingencia por dos horas.',
            confirmButtonText: 'Aceptar'
        });
    };
    const handleClose = () => {
        const deactivationEvent = new CustomEvent('contingencyDeactivated');
        window.dispatchEvent(deactivationEvent);
    
        onClose();
    };

    if (!isOpen) return null;

    return (
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
                <div className="relative z-0 w-full mb-5 group mt-4">
                    <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-principalColor peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Descripcion:
                    </label>
                    <input
                        type="text"
                        name="descripcion"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-principalColor peer"
                        placeholder="Escribir descripcion"
                        required
                    />
                </div>
                <p className="text-red-600 text-center mb-6">
                    Una vez activado el modo contingencia tiene 2 horas para facturar y confirmar si ya soluciono el problema
                </p>
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
    );
};

export default ModalContingency;
