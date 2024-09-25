"use client";
import React, { useState } from 'react';
import { FaSearch, FaDownload, FaTrashAlt, FaEye } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import BillDetailsModal from '@/components/layouts/modalBillDetails';

const BillList = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const openModal = (bill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const bills = [
        {
            documentNumber: '123456',
            client: 'Juan Perez',
            date: '08/17/2023',
            documentType: 'Electrónica',
            modality: 'Electrónica',
            details: 'Factura de venta de productos electrónicos.',
        },
        {
            documentNumber: '789012',
            client: 'Maria Lopez',
            date: '08/18/2023',
            documentType: 'Computarizada',
            modality: 'Computarizada',
            details: 'Factura de venta de servicios de software.',
        },
    ];

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
                            {bills.map((bill, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border text-gray-800">{bill.documentNumber}</td>
                                    <td className="px-4 py-2 border text-gray-800">{bill.client}</td>
                                    <td className="px-4 py-2 border text-gray-800">{bill.date}</td>
                                    <td className="px-4 py-2 border text-gray-800">{bill.documentType}</td>
                                    <td className="px-4 py-2 border">
                                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                                            {bill.modality}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border flex space-x-2">
                                        <button className="text-red-500 hover:text-red-700">
                                            <FaTrashAlt />
                                        </button>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => openModal(bill)}
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span class="font-semibold text-gray-900 dark:text-white">1000</span></span>
                        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                            </li>
                            <li>
                                <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                            </li>
                        </ul>
                    </nav>
                    <div className="flex space-x-1 justify-center">
                        <button className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
                            Prev
                        </button>
                        <button className="min-w-9 rounded-full bg-slate-800 py-2 px-3.5 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
                            1
                        </button>
                        <button className="min-w-9 rounded-full border border-slate-300 py-2 px-3.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
                            2
                        </button>
                        <button className="min-w-9 rounded-full border border-slate-300 py-2 px-3.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
                            3
                        </button>
                        <button className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de detalles de factura */}
            <BillDetailsModal isOpen={isModalOpen} onClose={closeModal} bill={selectedBill} />
        </div>
    );
};

export default BillList;
