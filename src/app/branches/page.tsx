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

                        {/* Barra de búsqueda */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por descripción, ciudad o empresa"
                                className="border p-2 w-full rounded-lg"
                            />
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Descripción</th>
                                        <th className="px-6 py-4 font-bold">Ciudad</th>
                                        <th className="px-6 py-4 font-bold">Empresa</th>
                                        <th className="px-6 py-4 font-bold">Estado</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBranches.map((branch) => (
                                        <tr key={branch.idSucursales} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{branch.descripcion}</td>
                                            <td className="px-6 py-4">{branch.ciudad}</td>
                                            <td className="px-6 py-4">{branch.empresa}</td>
                                            <td className="px-6 py-4">{branch.estado}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    {/* Botón de Borrar */}
                                                    <button
                                                        onClick={() => handleDeleteBranch(branch.idSucursales)}
                                                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                                                    >
                                                        <FaTrashAlt className="text-black" />
                                                    </button>

                                                    {/* Botón de Editar */}
                                                    <button
                                                        onClick={() => handleEditBranch(branch.idSucursales)}
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                                                    >
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
