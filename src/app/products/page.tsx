"use client";
import React, { useState } from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';

const ProductList = () => {
    const products = [
        { id: 1, name: 'ARDUINO IV AZUL', cost: '20 Bs.', discount: '0.5%', quantity: 1, total: '20 Bs.', image: '/images/imac.png' },
        { id: 2, name: 'ARDUINO IV AZUL', cost: '20 Bs.', discount: '0.5%', quantity: 1, total: '20 Bs.', image: '/images/ipad-11.png' },
        { id: 3, name: 'ARDUINO IV AZUL', cost: '20 Bs.', discount: '0.5%', quantity: 1, total: '20 Bs.', image: '/images/iphone-12.png' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(products.length / rowsPerPage);
    const paginatedProducts = products.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
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
            {/* Sidebar */}
            <Sidebar />
            {/* Contenido principal */}
            <div className="flex flex-col w-full min-h-screen">
                {/* Header */}
                <Header />

                {/* Contenido principal */}
                <div className="p-6 bg-gray-50 h-screen w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Productos</h1>

                    {/* Botón para agregar producto */}
                    <div className="flex justify-end mb-4">
                        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-lg">
                            Agregar Producto
                        </button>
                    </div>

                    {/* Tabla de productos */}
                    <table className="min-w-full bg-white border border-gray-300 text-black">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Descripción</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Costo c/u</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Descuento</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Cantidad</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Total</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Operación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map((product) => (
                                <tr key={product.id} className="border-b">
                                    <td className="px-4 py-4 flex items-center space-x-4">
                                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
                                        <div>
                                            <p className="font-bold text-gray-800">{product.name}</p>
                                            <p className="text-sm text-gray-600">Descripción uno</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-gray-800">{product.cost}</td>
                                    <td className="px-4 py-4 text-gray-800">{product.discount}</td>
                                    <td className="px-4 py-4 text-gray-800">{product.quantity}</td>
                                    <td className="px-4 py-4 text-gray-800">{product.total}</td>
                                    <td className="px-4 py-4 flex space-x-2">
                                        {/* Iconos de Borrar y Editar */}
                                        <button className="text-red-500 hover:text-red-700">
                                            <FaTrashAlt />
                                        </button>
                                        <button className="text-blue-500 hover:text-blue-700">
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="flex space-x-1 justify-center mt-6">
                        <button
                            onClick={handlePrevPage}
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
                            onClick={handleNextPage}
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

export default ProductList;
