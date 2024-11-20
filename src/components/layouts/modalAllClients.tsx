import React, { useEffect, useState } from 'react';
import { PATH_URL_BACKEND } from '@/utils/constants';
import Swal from 'sweetalert2';
import CreateEditClientModal from '@/components/layouts/modalCreateEditClient';
import { FaPlus, FaSearch } from 'react-icons/fa';

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
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(7);

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
                const sortedClients = data.sort((a, b) => b.id - a.id);
                setClients(data);
            } else {
                Swal.fire('Error', 'Error al obtener la lista de clientes', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    const handleCreateClient = () => {
        setSelectedClient(null);
        setIsClientModalOpen(true);
    };

    const handleEditClient = (client: Client) => {
        setSelectedClient(client);
        setIsClientModalOpen(true);
    };

    const handleSaveClient = (savedClient: Client) => {
        setIsClientModalOpen(false);
        fetchClients();
    };

    const filteredClients = clients.filter(client =>
        client.nombreRazonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.numeroDocumento.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

    const currentClients = filteredClients.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const getPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 h-auto max-h-[95%] w-full max-w-4xl overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Lista de Clientes</h2>
                    <button
                        onClick={handleCreateClient}
                        className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-lg h-10 flex items-center justify-center"
                    >
                        <FaPlus /> <span>Crear Cliente</span>
                    </button>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute right-3 top-3 text-gray-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3">Nombre</th>
                                <th className="px-6 py-3">Documento</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentClients.map((client) => (
                                <tr
                                    key={client.id}
                                    className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onSelectClient(client)}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">{client.nombreRazonSocial}</td>
                                    <td className="px-6 py-4">{client.numeroDocumento}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClient(client);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col items-center mt-6">
                    <div className="flex justify-center space-x-1 mb-2">
                    <button
                            onClick={handleFirstPage}
                            className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Primero
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Ant.
                        </button>

                        {getPageNumbers().map((number) => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={`rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 ${currentPage === number ? 'bg-slate-800 text-white' : ''}`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Sig.
                        </button>
                        <button
                            onClick={handleLastPage}
                            className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            Último
                        </button>
                    </div>

                    <div className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-2">
                        Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                    </div>
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

            {isClientModalOpen && (
                <CreateEditClientModal
                    isOpen={isClientModalOpen}
                    onClose={() => setIsClientModalOpen(false)}
                    customer={selectedClient || { id: 0, nombreRazonSocial: '', numeroDocumento: '', complemento: '', codigoTipoDocumentoIdentidad: 0, codigoCliente: '', email: '' }}
                    onSave={handleSaveClient}
                />
            )}
        </div>
    );
};

export default ModalAllClients;
