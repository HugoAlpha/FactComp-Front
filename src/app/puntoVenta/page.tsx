"use client";
import React, { useState, useEffect } from 'react';
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import ModalCreatePos from '@/components/layouts/modalCreatePos';

interface PuntoVenta {
    id: number;
    descripcion: string;
    sucursal: string;
    nombrePuntoVenta: string;
    cuis: string;
    tipoPuntoVenta: string;
    estado: string;
}

const PuntoVenta: React.FC = () => {
    const [customers, setCustomers] = useState<PuntoVenta[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCustomers, setFilteredCustomers] = useState<PuntoVenta[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedSucursal, setSelectedSucursal] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const data: PuntoVenta[] = [
            { id: 1, descripcion: 'Punto 1', sucursal: 'Sucursal A', nombrePuntoVenta: 'PV 1', cuis: '123', tipoPuntoVenta: 'Físico', estado: 'Activo' },
            { id: 2, descripcion: 'Punto 2', sucursal: 'Sucursal B', nombrePuntoVenta: 'PV 2', cuis: '124', tipoPuntoVenta: 'Virtual', estado: 'Inactivo' },
            // Agrega más puntos de venta si es necesario
        ];
        setCustomers(data);
        setFilteredCustomers(data);
    }, []);

    useEffect(() => {
        let filtered = customers;

        if (searchTerm) {
            filtered = filtered.filter((customer) =>
                customer.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.nombrePuntoVenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.cuis.includes(searchTerm)
            );
        }

        if (selectedSucursal) {
            filtered = filtered.filter((customer) => customer.sucursal === selectedSucursal);
        }

        setFilteredCustomers(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedSucursal, customers]);

    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEditPuntoVenta = (id: number) => {
        console.log(`Editar punto de venta con id: ${id}`);
    };

    const handleDeletePuntoVenta = (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este punto de venta?");
        if (confirmDelete) {
            console.log(`Eliminar punto de venta con id: ${id}`);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                        <h2 className="text-xl font-semibold mb-4 text-black">Lista de Puntos de Venta</h2>

                        {/* Filtro por Sucursal */}
                        <div className="mb-4">
                            <label className="mr-2 text-black">Filtrar por Sucursal:</label>
                            <select
                                value={selectedSucursal}
                                onChange={(e) => setSelectedSucursal(e.target.value)}
                                className="border p-2"
                            >
                                <option value="">Todas</option>
                                <option value="Sucursal A">Sucursal A</option>
                                <option value="Sucursal B">Sucursal B</option>
                            </select>
                        </div>

                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por descripción, nombre o CUIS..."
                                className="border p-2 rounded-lg w-1/3"
                            />
                            <button
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-lg"
                                onClick={handleOpenModal}
                            >
                                Agregar Punto de Venta
                            </button>
                        </div>

                        <ModalCreatePos
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onSave={(newPos) => {
                                // lógica para guardar nuevo punto de venta
                            }}
                        />

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Descripción</th>
                                        <th className="px-6 py-4 font-bold">Sucursal</th>
                                        <th className="px-6 py-4 font-bold">Nombre</th>
                                        <th className="px-6 py-4 font-bold">CUIS</th>
                                        <th className="px-6 py-4 font-bold">Tipo</th>
                                        <th className="px-6 py-4 font-bold">Estado</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{customer.descripcion}</td>
                                            <td className="px-6 py-4">{customer.sucursal}</td>
                                            <td className="px-6 py-4">{customer.nombrePuntoVenta}</td>
                                            <td className="px-6 py-4">{customer.cuis}</td>
                                            <td className="px-6 py-4">{customer.tipoPuntoVenta}</td>
                                            <td className="px-6 py-4">{customer.estado}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    {/* Botón de Borrar */}
                                                    <button 
                                                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300" 
                                                        onClick={() => handleDeletePuntoVenta(customer.id)}>
                                                        <FaTrashAlt className="text-black" />
                                                    </button>
                                                    
                                                    {/* Botón de Editar */}
                                                    <button 
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300" 
                                                        onClick={() => handleEditPuntoVenta(customer.id)}>
                                                        <FaEdit className="text-black" />
                                                    </button>
                                                </div>
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
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'} focus:bg-slate-800 focus:text-white active:border-slate-600`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuntoVenta;
