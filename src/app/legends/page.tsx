"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";
import { FaEdit, FaSearch, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { PATH_URL_BACKEND } from "@/utils/constants";

interface Legend {
    id: number;
    codigoActividad: string;
    descripcionLeyenda: string;
}

const Legends: React.FC = () => {
    const [legends, setLegends] = useState<Legend[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredLegends, setFilteredLegends] = useState<Legend[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchLegends = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/leyendas`);
                if (response.ok) {
                    const data: Legend[] = await response.json();
                    setLegends(data);
                    setFilteredLegends(data);
                } else {
                    Swal.fire('Error', 'Error al obtener las leyendas', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        };

        fetchLegends();
    }, []);

    const checkServerCommunication = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/verificar-comunicacion`);
            if (!response.ok) {
                if (response.status === 500) {
                    Swal.fire({
                        title: 'La comunicación con impuestos falló',
                        text: '¿Desea entrar en modo de contingencia?',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                            cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log('Modo de contingencia aceptado.');
                        } else {
                            console.log('Modo de contingencia cancelado.');
                        }
                    });
                } else {
                    console.error("Error de comunicación con el servidor:", response.statusText);
                }
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire({
                title: 'La comunicación con impuestos falló',
                text: '¿Desea entrar en modo de contingencia?',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                    cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Modo de contingencia aceptado.');
                } else {
                    console.log('Modo de contingencia cancelado.');
                }
            });
        }
    };

    useEffect(() => {
        checkServerCommunication();
    }, []);

    useEffect(() => {
        let filtered = legends;

        if (searchTerm) {
            filtered = filtered.filter((legend) =>
                legend.descripcionLeyenda.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredLegends(filtered);
        setCurrentPage(1);
    }, [searchTerm, legends]);

    const totalPages = Math.ceil(filteredLegends.length / rowsPerPage);
    const paginatedLegends = filteredLegends.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
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
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-black">
                                Datos de Leyendas de Factura
                            </h2>
                        </div>
                        <div className="flex justify-between mb-4">
                            <div>
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm h-10">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border px-2  h-10 rounded-lg w-20"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>

                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <div className="relative flex items-center w-full max-w-md">

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar Registro"
                                    className="border px-2 h-10 w-full rounded-lg"
                                />
                                <FaSearch className="absolute right-4 text-gray-500 text-xl pointer-events-none " />
                            </div>
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Código Actividad</th>
                                        <th className="px-6 py-4 font-bold">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedLegends.map((legend) => (
                                        <tr key={legend.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4 text-black">{legend.codigoActividad}</td>
                                            <td className="px-6 py-4 text-black">{legend.descripcionLeyenda}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Ant.
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage
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
                                className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Sig.
                            </button>
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Legends;
