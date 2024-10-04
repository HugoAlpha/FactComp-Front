"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
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
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
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

    const handleEditLegend = (id: number) => {
        console.log(`Editar leyenda con id: ${id}`);
        Swal.fire("Función no implementada", "Edición de leyendas no disponible", "info");
    };

    const handleDeleteLegend = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarla",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(`Eliminar leyenda con id: ${id}`);
                Swal.fire("Eliminada!", "La leyenda ha sido eliminada.", "success");
            }
        });
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
                        <div className="mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar Registro"
                                className="border p-2 w-full rounded-lg"
                            />
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
                                Prev
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
                                Next
                            </button>
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
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

export default Legends;
