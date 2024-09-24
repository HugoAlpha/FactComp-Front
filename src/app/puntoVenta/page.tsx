"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

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

    
    useEffect(() => {
        
        const data: PuntoVenta[] = [
            { id: 1, descripcion: 'Punto 1', sucursal: 'Sucursal A', nombrePuntoVenta: 'PV 1', cuis: '123', tipoPuntoVenta: 'Físico', estado: 'Activo' },
            { id: 2, descripcion: 'Punto 2', sucursal: 'Sucursal B', nombrePuntoVenta: 'PV 2', cuis: '124', tipoPuntoVenta: 'Virtual', estado: 'Inactivo' }, 
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
    

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="p-6 bg-gray-50 h-screen w-full">
                    <h2 className="text-xl font-semibold mb-4 text-black">Lista de Puntos de venta</h2>

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

                    <div className="mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por descripción, nombre o CUIS"
                            className="border p-2 w-full"
                        />
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
                                <th className="border px-4 py-2 text-black">Descripción</th>
                                <th className="border px-4 py-2 text-black">Sucursal</th>
                                <th className="border px-4 py-2 text-black">Nombre Punto Venta</th>
                                <th className="border px-4 py-2 text-black">CUIS</th>
                                <th className="border px-4 py-2 text-black">Tipo Punto Venta</th>
                                <th className="border px-4 py-2 text-black">Estado</th>
                                <th className="border px-4 py-2 text-black">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td className="border px-4 py-2">{customer.descripcion}</td>
                                    <td className="border px-4 py-2">{customer.sucursal}</td>
                                    <td className="border px-4 py-2">{customer.nombrePuntoVenta}</td>
                                    <td className="border px-4 py-2">{customer.cuis}</td>
                                    <td className="border px-4 py-2">{customer.tipoPuntoVenta}</td>
                                    <td className="border px-4 py-2">{customer.estado}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleEditPuntoVenta(customer.id)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePuntoVenta(customer.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
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

                </div>
            </div>
        </div>
    );
};

export default PuntoVenta;
