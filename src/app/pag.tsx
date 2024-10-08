"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import CreateEditClientModal from '@/components/layouts/modalCreateEditClient';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface Customer {
    id: number;
    nombreRazonSocial: string;
    codigoTipoDocumentoIdentidad: number;
    numeroDocumento: string;
    complemento: string | null;
    codigoCliente: string;
    email: string;
}

const ClientList = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer>({
        id: 0,
        nombreRazonSocial: '',
        codigoTipoDocumentoIdentidad: 0,
        numeroDocumento: '',
        complemento: '',
        codigoCliente: '',
        email: '',
    });
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/api/clientes`);
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
                Swal.fire('Error', 'Error al obtener los clientes', 'error');
            }
        };

        fetchCustomers();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const filteredCustomers = customers.filter((customer) =>
        Object.values(customer)
            .some((field) => field && field.toString().toLowerCase().includes(filter.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEditCustomer = (id: number) => {
        const customer = customers.find((c) => c.id === id);
        if (customer) {
            setCurrentCustomer(customer);
            setIsModalOpen(true);
        }
    };

    const handleDeleteCustomer = (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                setCustomers(customers.filter((c) => c.id !== id));
                Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
            }
        });
    };

    const handleAddOrEditCustomer = (customer: Customer) => {
        if (customer.id) {
            setCustomers(
                customers.map((c) => (c.id === customer.id ? { ...customer } : c))
            );
            Swal.fire('¡Actualizado!', 'El cliente ha sido actualizado.', 'success');
        } else {
            const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
            setCustomers([...customers, { ...customer, id: newId }]);
            Swal.fire('¡Agregado!', 'El cliente ha sido agregado exitosamente.', 'success');
        }
        setIsModalOpen(false);
        setCurrentCustomer({
            id: 0,
            nombreRazonSocial: '',
            codigoTipoDocumentoIdentidad: 0,
            numeroDocumento: '',
            complemento: '',
            codigoCliente: '',
            email: '',
        });
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 4;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Clientes</h2>

                        {/* Barra de búsqueda y selector de filas */}
                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                placeholder="Buscar cliente por nombre o documento..."
                                className="border p-2 rounded-lg w-1/3"
                                value={filter}
                                onChange={handleFilterChange}
                            />
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="border p-2 rounded-lg w-20"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={40}>40</option>
                                <option value={50}>50</option>
                            </select>
                            <button
                                className="bg-sixthColor text-white py-2 px-4 rounded-lg hover:bg-thirdColor text-lg"
                                onClick={() => {
                                    setCurrentCustomer({
                                        id: 0,
                                        nombreRazonSocial: '',
                                        codigoTipoDocumentoIdentidad: 0,
                                        numeroDocumento: '',
                                        complemento: '',
                                        codigoCliente: '',
                                        email: '',
                                    });
                                    setIsModalOpen(true);
                                }}
                            >
                                Agregar Cliente <FaPlus className="inline-block ml-2" />
                            </button>
                            <CreateEditClientModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onSave={handleAddOrEditCustomer}
                                customer={currentCustomer}
                            />
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Nombre/Razón Social</th>
                                        <th className="px-6 py-4 font-bold">Tipo Doc.</th>
                                        <th className="px-6 py-4 font-bold">Número Documento</th>
                                        <th className="px-6 py-4 font-bold">Complemento</th>
                                        <th className="px-6 py-4 font-bold">Código Cliente</th>
                                        <th className="px-6 py-4 font-bold">Email</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{customer.nombreRazonSocial}</td>
                                            <td className="px-6 py-4">{customer.codigoTipoDocumentoIdentidad}</td>
                                            <td className="px-6 py-4">{customer.numeroDocumento}</td>
                                            <td className="px-6 py-4">{customer.complemento}</td>
                                            <td className="px-6 py-4">{customer.codigoCliente}</td>
                                            <td className="px-6 py-4">{customer.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    <button 
                                                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                                                        onClick={() => handleDeleteCustomer(customer.id)}
                                                    >
                                                        <FaTrashAlt className="text-black" />
                                                    </button>
                                                    <button 
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                                                        onClick={() => handleEditCustomer(customer.id)}
                                                    >
                                                        <FaEdit className="text-black" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                                <span className="text-sm text-gray-700">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Anterior
                                    </button>
                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            className={`px-4 py-2 border rounded-lg ${
                                                currentPage === page
                                                    ? 'bg-gray-300 text-gray-700'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        className="px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-100"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientList;
