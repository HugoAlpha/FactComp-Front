"use client";
import React, { useState } from 'react';
import { FaSearch, FaDownload, FaTrashAlt, FaEdit } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';

const BillList = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Contenido principal */}
            <div className="flex flex-col w-full min-h-screen">
                {/* Header */}
                <Header />

                {/* Contenido principal */}
                <div className="p-6 bg-gray-50 h-screen w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-700">Lista de Facturas</h1>

                    {/* Barra de búsqueda, botones de archivo y dropdown */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Botón de Emitir Factura */}
                        <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 text-lg">
                            EMITIR FACTURA
                        </button>

                        {/* Barra de búsqueda */}
                        <div className="relative flex items-center w-1/2">
                            <input
                                type="text"
                                placeholder="Buscar factura"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="border border-gray-300 rounded-lg py-3 px-4 w-full text-lg"
                            />
                            <FaSearch className="absolute right-3 text-gray-500 text-2xl" />
                        </div>

                        {/* Botones de descarga de archivo */}
                        <div className="inline-flex rounded-lg overflow-hidden">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 flex items-center">
                                <FaDownload className="mr-2" /> PDF
                            </button>
                            <button className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4">
                                DOCX
                            </button>
                            <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4">
                                XML
                            </button>
                            <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4">
                                TXT
                            </button>
                        </div>
                    </div>

                    {/* Dropdown y Fecha inicio y fin */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Dropdown para tipo de factura */}
                        <div className="flex">
                            <select className="border border-gray-300 rounded-lg py-2 px-4 text-gray-700">
                                <option>Tipo Factura 1</option>
                                <option>Tipo Factura 2</option>
                                <option>Tipo Factura 3</option>
                            </select>
                        </div>

                        {/* Contenedor de fechas */}
                        <div className="flex space-x-4">
                            <div className="flex flex-col items-start">
                                <label className="block text-base font-bold text-gray-700">Fecha Inicio</label>
                                <input
                                    className="mt-1 block w-full rounded-md border bg-white px-3 py-2 shadow-sm focus:border-colorAlpha focus:outline-none focus:ring-colorAlpha sm:text-sm border-colorAlpha"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label className="block text-base font-bold text-gray-700">Fecha Fin</label>
                                <input
                                    className="mt-1 block w-full rounded-md border bg-white px-3 py-2 shadow-sm focus:border-colorAlpha focus:outline-none focus:ring-colorAlpha sm:text-sm border-colorAlpha"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabla de facturas */}
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">N° Documento</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Cliente</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Fecha</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Tipo Documento</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Modalidad</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Operación</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 border text-gray-800">123456</td>
                                <td className="px-4 py-2 border text-gray-800">Juan Perez</td>
                                <td className="px-4 py-2 border text-gray-800">08/17/2023</td>
                                <td className="px-4 py-2 border text-gray-800">Electrónica</td>
                                <td className="px-4 py-2 border">
                                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                                        Electrónica
                                    </span>
                                </td>
                                <td className="px-4 py-2 border flex space-x-2">
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaTrashAlt />
                                    </button>
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td className="px-4 py-2 border text-gray-800">789012</td>
                                <td className="px-4 py-2 border text-gray-800">Maria Lopez</td>
                                <td className="px-4 py-2 border text-gray-800">08/18/2023</td>
                                <td className="px-4 py-2 border text-gray-800">Computarizada</td>
                                <td className="px-4 py-2 border">
                                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                        Computarizada
                                    </span>
                                </td>
                                <td className="px-4 py-2 border flex space-x-2">
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaTrashAlt />
                                    </button>
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="mt-4 flex justify-between">
                        <button className="text-gray-600">Previous</button>
                        <div className="space-x-2">
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">1</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">2</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">3</button>
                        </div>
                        <button className="text-gray-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillList;
