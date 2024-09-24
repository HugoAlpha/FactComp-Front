"use client";

import React, { useState, useEffect } from 'react';
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface Branch {
    idSucursales: number;
    descripcion: string;
    ciudad: string;
    empresa: string;
    estado: string;
}

const Branches: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]); 
    const [rowsPerPage, setRowsPerPage] = useState<number>(5); 
    const [currentPage, setCurrentPage] = useState<number>(1); 
    const [selectedCity, setSelectedCity] = useState<string>(''); 

    useEffect(() => {
        
        const data: Branch[] = [
            { idSucursales: 1, descripcion: 'Sucursal Principal', ciudad: 'Ciudad A', empresa: 'Empresa X', estado: 'Activo' },
            { idSucursales: 2, descripcion: 'Sucursal Secundaria', ciudad: 'Ciudad B', empresa: 'Empresa Y', estado: 'Inactivo' },
        ];
        setBranches(data);
        setFilteredBranches(data);
    }, []);

    useEffect(() => {
        let filtered = branches;

        
        if (searchTerm) {
            filtered = filtered.filter((branch) =>
                branch.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.empresa.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        
        if (selectedCity) {
            filtered = filtered.filter((branch) => branch.ciudad === selectedCity);
        }

        setFilteredBranches(filtered);
        setCurrentPage(1); 
    }, [searchTerm, selectedCity, branches]);

    const totalPages = Math.ceil(filteredBranches.length / rowsPerPage);
    const paginatedBranches = filteredBranches.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEditBranch = (id: number) => {
        console.log(`Editar sucursal con id: ${id}`);
    };
    
    const handleDeleteBranch = (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta sucursal?");
        if (confirmDelete) {
            console.log(`Eliminar sucursal con id: ${id}`);
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="p-6 bg-gray-50 h-screen w-full">
                    <h2 className="text-xl font-semibold mb-4 text-black">Lista de Sucursales</h2>

                    {/* Filtro por Ciudad */}
                    <div className="mb-4">
                        <label className="mr-2 text-black">Filtrar por Ciudad:</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="border p-2"
                        >
                            <option value="">Todas</option>
                            <option value="Ciudad A">Ciudad A</option>
                            <option value="Ciudad B">Ciudad B</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por descripción, ciudad o empresa"
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
                                <th className="border px-4 py-2 text-black">ID Sucursal</th>
                                <th className="border px-4 py-2 text-black">Descripción</th>
                                <th className="border px-4 py-2 text-black">Ciudad</th>
                                <th className="border px-4 py-2 text-black">Empresa</th>
                                <th className="border px-4 py-2 text-black">Estado</th>
                                <th className="border px-4 py-2 text-black">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBranches.map((branch) => (
                                <tr key={branch.idSucursales}>
                                    <td className="border px-4 py-2">{branch.idSucursales}</td>
                                    <td className="border px-4 py-2">{branch.descripcion}</td>
                                    <td className="border px-4 py-2">{branch.ciudad}</td>
                                    <td className="border px-4 py-2">{branch.empresa}</td>
                                    <td className="border px-4 py-2">{branch.estado}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleEditBranch(branch.idSucursales)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBranch(branch.idSucursales)}
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

export default Branches;
