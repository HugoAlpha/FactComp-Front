"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaTrashAlt, FaEye, FaTimes } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface FormattedBill {
    documentNumber: string;
    client: string;
    date: string;
    total: string;
    estado: string;
    codigoSucursal: number;
    codigoPuntoVenta: number;
}

const BillList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBill, setSelectedBill] = useState<FormattedBill | null>(null);
    const [bills, setBills] = useState<FormattedBill[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(bills.length / rowsPerPage);
    const paginatedBills = bills.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/factura`);
                if (response.ok) {
                    const data = await response.json();
                    const formattedData = data.map((bill: any) => ({
                        documentNumber: bill.numeroDocumento,
                        client: bill.nombreRazonSocial,
                        date: new Date(bill.fechaEmision).toLocaleDateString(),
                        total: bill.montoTotal.toFixed(2),
                        estado: 'Válida',
                        codigoSucursal: bill.codigoSucursal,
                        codigoPuntoVenta: bill.codigoPuntoVenta,
                    }));
                    setBills(formattedData);
                } else {
                    console.error('Error fetching bills');
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };
        fetchBills();
    }, []);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const toggleBillDetails = (bill: FormattedBill | null) => {
        setSelectedBill(bill);
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
                    <div className="p-6 flex">
                        <div className={`${selectedBill ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
                            <h1 className="text-2xl font-bold mb-6 text-gray-700">Lista de Facturas</h1>
                            <div className="flex items-center justify-between mb-6">
                                <button className="bg-slate-400 text-white py-3 px-6 rounded-lg hover:bg-thirdColor text-lg">
                                    EMITIR FACTURA
                                </button>
                                <div className="relative flex items-center w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Buscar factura"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="border border-gray-300 rounded-lg py-3 px-4 w-full text-lg"
                                    />
                                    <FaSearch className="absolute right-3 text-gray-500 text-2xl" />
                                </div>
                            </div>

                            <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                                <table className="table-auto w-full bg-white">
                                    <thead>
                                        <tr className="bg-fourthColor text-left text-gray-700">
                                            <th className="px-6 py-4 font-bold">Número de Documento</th>
                                            <th className="px-6 py-4 font-bold">Cliente</th>
                                            <th className="px-6 py-4 font-bold">Fecha</th>
                                            <th className="px-6 py-4 font-bold">Total</th>
                                            <th className="px-6 py-4 font-bold">Estado</th>
                                            <th className="px-6 py-4 font-bold">Operaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedBills.map((bill) => (
                                            <tr key={bill.documentNumber} className="border-b hover:bg-gray-50 text-black">
                                                <td className="px-6 py-4">{bill.documentNumber}</td>
                                                <td className="px-6 py-4">{bill.client}</td>
                                                <td className="px-6 py-4">{bill.date}</td>
                                                <td className="px-6 py-4">{bill.total}</td>
                                                <td className="px-6 py-4">{bill.estado}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex">
                                                        <button
                                                            className="bg-green-200 hover:bg-green-300 p-2 rounded-l-lg flex items-center justify-center border border-green-300"
                                                            onClick={() => toggleBillDetails(bill)}
                                                        >
                                                            <FaEye className="text-black" />
                                                        </button>
                                                        <button className="bg-red-200 hover:bg-red-300 p-2 rounded-r-lg flex items-center justify-center border border-red-300">
                                                            <FaTrashAlt className="text-black" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex space-x-1 justify-center mt-6">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Next
                                </button>
                            </div>

                            <div className="flex space-x-1 justify-center mt-2">
                                <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                    Mostrando página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
                                </span>
                            </div>
                        </div>

                        {selectedBill && (
                            <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg ml-6 relative">
                                <button
                                    onClick={() => toggleBillDetails(null)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes size={24} />
                                </button>
                                <h2 className="text-xl font-bold mb-4">Detalles de la Factura</h2>
                                <p><strong>Número de Documento:</strong> {selectedBill.documentNumber}</p>
                                <p><strong>Cliente:</strong> {selectedBill.client}</p>
                                <p><strong>Fecha:</strong> {selectedBill.date}</p>
                                <p><strong>Total:</strong> {selectedBill.total}</p>
                                <p><strong>Estado:</strong> {selectedBill.estado}</p>
                                <p><strong>Código Sucursal:</strong> {selectedBill.codigoSucursal}</p>
                                <p><strong>Código Punto de Venta:</strong> {selectedBill.codigoPuntoVenta}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillList;