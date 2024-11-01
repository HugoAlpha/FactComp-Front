import React, { useEffect, useState } from 'react';
import { PATH_URL_BACKEND } from '@/utils/constants';
import Swal from 'sweetalert2';

interface Client {
    id: number;
    nombreRazonSocial: string;
    numeroDocumento: string;
}

interface ModalAllClientsProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectClient: (client: Client) => void;
}

const ModalAllClients: React.FC<ModalAllClientsProps> = ({ isOpen, onClose, onSelectClient }) => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchClients();
        }
    }, [isOpen]);

    const fetchClients = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/api/clientes/`);
            if (response.ok) {
                const data: Client[] = await response.json();
                setClients(data);
            } else {
                Swal.fire('Error', 'Error al obtener la lista de clientes', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Lista de Clientes</h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            onClick={() => onSelectClient(client)}
                            className="cursor-pointer flex items-center bg-white border rounded-lg p-2 shadow transition-all duration-300 hover:bg-gray-100"
                        >
                            <div className="flex-grow">
                                <h3 className="text-sm font-semibold">{client.nombreRazonSocial}</h3>
                                <p className="text-sm text-gray-600">{client.numeroDocumento}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 font-semibold"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAllClients;
