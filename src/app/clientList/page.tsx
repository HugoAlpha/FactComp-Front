"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert';
import CreateEditClientModal from '@/components/layouts/modalCreateEditClient';

interface Customer {
    id: number;
    razonSocial: string;
    nroDocumento: string;
    complemento: string;
    tipoDocumento: string;
    telefono: string;
    correo: string;
}

const initialCustomers: Customer[] = [
    {
        id: 1,
        razonSocial: 'Empresa ABC',
        nroDocumento: '12345678',
        complemento: 'A',
        tipoDocumento: 'CI',
        telefono: '555-1234',
        correo: 'abc@empresa.com',
    },
    {
        id: 2,
        razonSocial: 'Empresa XYZ',
        nroDocumento: '87654321',
        complemento: 'B',
        tipoDocumento: 'NIT',
        telefono: '555-5678',
        correo: 'xyz@empresa.com',
    },
];

const ClientList = () => {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [filter, setFilter] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer>({
        id: 0,
        razonSocial: '',
        nroDocumento: '',
        complemento: '',
        tipoDocumento: '',
        telefono: '',
        correo: '',
    });
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1); 
    };

    const filteredCustomers = customers.filter((customer) =>
        Object.values(customer)
            .slice(1, -1)
            .some((field) => field.toLowerCase().includes(filter.toLowerCase()))
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
        Swal({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            buttons: ['Cancelar', 'Eliminar'],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                setCustomers(customers.filter((c) => c.id !== id));
                Swal('Eliminado!', 'El cliente ha sido eliminado.', 'success');
            }
        });
    };

    const handleAddOrEditCustomer = (customer: Customer) => {
        if (customer.id) {
            setCustomers(
                customers.map((c) => (c.id === customer.id ? { ...customer } : c))
            );
            Swal('¡Actualizado!', 'El cliente ha sido actualizado.', 'success');
        } else {
            const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
            setCustomers([...customers, { ...customer, id: newId }]);
            Swal('¡Agregado!', 'El cliente ha sido agregado exitosamente.', 'success');
        }
        setIsModalOpen(false);
        setCurrentCustomer({
            id: 0,
            razonSocial: '',
            nroDocumento: '',
            complemento: '',
            tipoDocumento: '',
            telefono: '',
            correo: '',
        });
        setCurrentPage(1);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="p-6 bg-gray-50 h-screen w-full">
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
                                    razonSocial: '',
                                    nroDocumento: '',
                                    complemento: '',
                                    tipoDocumento: '',
                                    telefono: '',
                                    correo: '',
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
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>

                    <table className="table-auto w-full text-black">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-black">Razón Social</th>
                                <th className="border px-4 py-2 text-black">Número Documento</th>
                                <th className="border px-4 py-2 text-black">Complemento</th>
                                <th className="border px-4 py-2 text-black">Tipo Documento</th>
                                <th className="border px-4 py-2 text-black">Teléfono</th>
                                <th className="border px-4 py-2 text-black">Correo</th>
                                <th className="border px-4 py-2 text-black">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td className="border px-4 py-2">{customer.razonSocial}</td>
                                    <td className="border px-4 py-2">{customer.nroDocumento}</td>
                                    <td className="border px-4 py-2">{customer.complemento}</td>
                                    <td className="border px-4 py-2">{customer.tipoDocumento}</td>
                                    <td className="border px-4 py-2">{customer.telefono}</td>
                                    <td className="border px-4 py-2">{customer.correo}</td>
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

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="self-center text-black">{`Página ${currentPage} de ${totalPages}`}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
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
    );
};

export default ClientList;
