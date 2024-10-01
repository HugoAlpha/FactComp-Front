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
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="flex-grow overflow-auto bg-white p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Lista de Actividades</h2>

                    {/* Filtro por Estado */}
                    <div className="mb-6">
                        <label className="mr-4 text-gray-600 font-medium">Filtrar por Estado:</label>
                        <select
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            className="border border-gray-300 rounded-lg p-2 text-gray-700"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Habilitado">Habilitado</option>
                            <option value="Deshabilitado">Deshabilitado</option>
                        </select>
                    </div>

                    {/* Seleccionar Actividades */}
                    <div className="mb-6">
                        <label className="mr-4 text-gray-600 font-medium">Seleccionar Actividades:</label>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            {actividades.map((actividad) => (
                                <label key={actividad.id} className="block text-gray-700">
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

                    {/* Filas por página */}
                    <div className="mb-6">
                        <label className="mr-4 text-gray-600 font-medium">Filas por página:</label>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg p-2 text-gray-700"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>

                    {/* Tabla de actividades */}
                    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                        <table className="table-auto w-full bg-white">
                            <thead>
                            <tr className="bg-fourthColor text-left text-gray-700">
                                <th className="px-6 py-4 font-bold">Código Producto Servicio</th>
                                <th className="px-6 py-4 font-bold">Descripción</th>
                                <th className="px-6 py-4 font-bold">Código Actividad</th>
                                <th className="px-6 py-4 font-bold">Estado</th>
                            </tr>

                            </thead>
                            <tbody>
                                {paginatedActividades.map((actividad) => (
                                    <tr key={actividad.id} className="border-b hover:bg-gray-50 text-black">
                                        <td className="px-6 py-4">{actividad.codigoProductoServicio}</td>
                                        <td className="px-6 py-4">{actividad.descripcion}</td>
                                        <td className="px-6 py-4">{actividad.codigoActividadNandina}</td>
                                        <td className="px-6 py-4">
    <div className="flex items-center">
        <div
            className={`h-2.5 w-2.5 rounded-full me-2 ${
                actividad.estado === 'Habilitado' ? 'bg-green-500' : 'bg-red-500'
            }`}
        ></div>
        <div
            className={`px-2 py-1 rounded-lg ${
                actividad.estado === 'Habilitado' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
        >
            <span>
                {actividad.estado}
            </span>
        </div>
    </div>
</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full py-2 px-4 bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Anterior
                        </button>

                        <div className="flex space-x-2">
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`py-2 px-4 rounded-full ${
                                        page === currentPage
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full py-2 px-4 bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;
