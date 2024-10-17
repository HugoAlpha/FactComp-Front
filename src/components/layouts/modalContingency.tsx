import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useEffect, useState } from 'react';

interface Evento {
    id: number;
    descripcion: string;
}

interface ModalContingencyProps {
    onClose: () => void;
    onConfirm: (eventoDescripcion: string) => void;
}

const ModalContingency: React.FC<ModalContingencyProps> = ({ onClose, onConfirm }) => {
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
}, [PATH_URL_BACKEND]);

    const handleConfirm = () => {
        if (!eventoSeleccionado) {
        alert('Por favor, selecciona un evento antes de continuar.');
        return;
        }
        onConfirm(eventoSeleccionado);
    };

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
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-seventhColor"
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
                onClick={onClose}
                className="w-1/2 bg-gray-300 text-gray-800 p-2 rounded-lg mr-2 hover:bg-gray-400"
            >
                Cancelar
            </button>
            <button
                onClick={handleConfirm}
                className="w-1/2 bg-firstColor text-white p-2 rounded-lg ml-2 hover:bg-blue-600"
            >
                Confirmar
            </button>
            </div>
        </div>
        </div>
    );
};

export default ModalContingency;
