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
                        <h2 className="text-xl font-semibold mb-4 text-black">Lista de Clientes</h2>

                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                className="border p-2 w-full text-black"
                                placeholder="Buscar clientes..."
                                value={filter}
                                onChange={handleFilterChange}
                            />
                            <button
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
                                className="ml-4 bg-green-700 text-white px-4 py-2 rounded flex items-center"
                            >
                                <FaPlus className="mr-2" /> Agregar Cliente
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="mr-2 text-black">Filas por página:</label>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                className="border p-2"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={30}>30</option>
                                <option value={40}>40</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-firstColor">
                                        <th className="border px-4 py-2 text-black">Nombre / Razón Social</th>
                                        <th className="border px-4 py-2 text-black">Número Documento</th>
                                        <th className="border px-4 py-2 text-black">Complemento</th>
                                        <th className="border px-4 py-2 text-black">Código Cliente</th>
                                        <th className="border px-4 py-2 text-black">Correo Electrónico</th>
                                        <th className="border px-4 py-2 text-black">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b">
                                            <td className="border px-4 py-2">{customer.nombreRazonSocial}</td>
                                            <td className="border px-4 py-2">{customer.numeroDocumento}</td>
                                            <td className="border px-4 py-2">{customer.complemento}</td>
                                            <td className="border px-4 py-2">{customer.codigoCliente}</td>
                                            <td className="border px-4 py-2">{customer.email}</td>
                                            <td className="border px-4 py-2">
                                                <button
                                                    onClick={() => handleEditCustomer(customer.id)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'} focus:bg-slate-800 focus:text-white active:border-slate-800 active:bg-slate-800`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Next
                            </button>
                        </div>
                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                            </span>
                        </div>

                        <CreateEditClientModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            customer={currentCustomer}
                            onSave={handleAddOrEditCustomer}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientList;
