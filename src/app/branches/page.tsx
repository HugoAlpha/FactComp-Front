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

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 text-black">
                            <thead>
                                <tr className="bg-gray-100">
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
                                    <tr key={branch.idSucursales} className="border-b">
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
                </div>
            </div>
        </div>
        </div>
    );
};

export default Branches;
