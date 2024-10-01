"use client";

import Header from '@/components/commons/header';
import Sidebar from '@/components/commons/sidebar';
import { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface Code {
    id: number;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    facturas: number;
    cuentas: number;
}

const CodeReceipt = () => {
    const [codes, setCodes] = useState<Code[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredCodes, setFilteredCodes] = useState<Code[]>([]);
    const [rowsPerPage] = useState<number>(10); 
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const data: Code[] = [
            {
                id: 1,
                descripcion: "CUIS Sucursal 1",
                fechaInicio: "2024-06-01T20:35:04.365",
                fechaFin: "2025-06-01T20:35:04.365",
                facturas: 120,
                cuentas: 50
            },
            {
                id: 2,
                descripcion: "CUIS Sucursal 2",
                fechaInicio: "2024-07-15T10:00:00.000",
                fechaFin: "2025-07-15T10:00:00.000",
                facturas: 95,
                cuentas: 40
            },
        ];
        setCodes(data);
        setFilteredCodes(data);
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = codes.filter(code =>
                code.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCodes(filtered);
            setCurrentPage(1);
        } else {
            setFilteredCodes(codes);
        }
    }, [searchTerm, codes]);

    const totalPages = Math.ceil(filteredCodes.length / rowsPerPage);
    const paginatedCodes = filteredCodes.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEditCode = (id: number) => {
        console.log(`Editar código con id: ${id}`);
        // Swal.fire("Función no implementada", "Edición de códigos no disponible", "info");
    };

    const handleDeleteCode = (id: number) => {
        console.log(`Eliminar código con id: ${id}`);
        // Swal.fire("Función no implementada", "Eliminación de códigos no disponible", "info");
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
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">CUIS</h1>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Buscar por descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-200 text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Descripción</th>
                                        <th className="px-6 py-4 font-bold">Fecha Inicio</th>
                                        <th className="px-6 py-4 font-bold">Fecha Fin</th>
                                        <th className="px-6 py-4 font-bold">Facturas</th>
                                        <th className="px-6 py-4 font-bold">Cuentas</th>
                                        <th className="px-6 py-4 font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCodes.length > 0 ? (
                                        paginatedCodes.map((code) => (
                                            <tr key={code.id} className="border-b hover:bg-gray-50 text-black">
                                                <td className="px-6 py-4">{code.descripcion}</td>
                                                <td className="px-6 py-4">{new Date(code.fechaInicio).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">{new Date(code.fechaFin).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">{code.facturas}</td>
                                                <td className="px-6 py-4">{code.cuentas}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleDeleteCode(code.id)}
                                                            className="bg-red-200 hover:bg-red-300 p-2 rounded flex items-center justify-center border border-red-300"
                                                        >
                                                            <FaTrashAlt className="text-black" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditCode(code.id)}
                                                            className="bg-blue-200 hover:bg-blue-300 p-2 rounded flex items-center justify-center border border-blue-300"
                                                        >
                                                            <FaEdit className="text-black" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                                No se encontraron resultados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${
                                        page === currentPage
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800"
                                    } focus:bg-slate-800 focus:text-white active:border-slate-800 active:bg-slate-800`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Next
                            </button>
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> de{" "}
                                <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeReceipt;
