"use client";
import React, { useState, useEffect } from 'react';
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";

interface Actividad {
    id: number;
    codigoProductoServicio: string;
    descripcion: string;
    codigoActividadNandina: string;
    estado: string;
}

const Activities: React.FC = () => {
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [selectedActividades, setSelectedActividades] = useState<number[]>([]);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('Todos');
    const [filteredActividades, setFilteredActividades] = useState<Actividad[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const data: Actividad[] = [
            { id: 1, codigoProductoServicio: '1001', descripcion: 'Servicio de Consultoría', codigoActividadNandina: '12345', estado: 'Habilitado' },
            { id: 2, codigoProductoServicio: '1002', descripcion: 'Venta de Productos', codigoActividadNandina: '67890', estado: 'Deshabilitado' },
            { id: 3, codigoProductoServicio: '1003', descripcion: 'Servicios de Marketing', codigoActividadNandina: '54321', estado: 'Habilitado' },
        ];
        setActividades(data);
        setFilteredActividades(data);
    }, []);

    useEffect(() => {
        let filtered = actividades;

        if (estadoFiltro !== 'Todos') {
            filtered = filtered.filter((actividad) => actividad.estado === estadoFiltro);
        }

        if (selectedActividades.length > 0) {
            filtered = filtered.filter((actividad) =>
                selectedActividades.includes(actividad.id)
            );
        }

        setFilteredActividades(filtered);
        setCurrentPage(1);
    }, [estadoFiltro, selectedActividades, actividades]);

    const totalPages = Math.ceil(filteredActividades.length / rowsPerPage);
    const paginatedActividades = filteredActividades.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSelectActividad = (id: number) => {
        setSelectedActividades((prev) =>
            prev.includes(id) ? prev.filter((actId) => actId !== id) : [...prev, id]
        );
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

                <div className="p-6 bg-gray-50 h-screen w-full">
                    <h2 className="text-xl font-semibold mb-4 text-black">Lista de Actividades</h2>

                    {/* Filtro por Estado */}
                    <div className="mb-4">
                        <label className="mr-2 text-black">Filtrar por Estado:</label>
                        <select
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            className="border p-2"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Habilitado">Habilitado</option>
                            <option value="Deshabilitado">Deshabilitado</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="mr-2 text-black">Seleccionar Actividades:</label>
                        <div className="border p-2 text-black">
                            {actividades.map((actividad) => (
                                <label key={actividad.id} className="block">
                                    <input
                                        type="checkbox"
                                        checked={selectedActividades.includes(actividad.id)}
                                        onChange={() => handleSelectActividad(actividad.id)}
                                        className="mr-2"
                                    />
                                    {actividad.descripcion}
                                </label>
                            ))}
                        </div>
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
                                <th className="border px-4 py-2">Código Producto Servicio</th>
                                <th className="border px-4 py-2">Descripción</th>
                                <th className="border px-4 py-2">Código Actividad</th>
                                <th className="border px-4 py-2">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedActividades.map((actividad) => (
                                <tr key={actividad.id}>
                                    <td className="border px-4 py-2">{actividad.codigoProductoServicio}</td>
                                    <td className="border px-4 py-2">{actividad.descripcion}</td>
                                    <td className="border px-4 py-2">{actividad.codigoActividadNandina}</td>
                                    <td className={`border px-4 py-2 ${actividad.estado === 'Habilitado' ? 'text-green-600' : 'text-red-600'}`}>
                                        {actividad.estado}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
    );
};

export default Activities;
