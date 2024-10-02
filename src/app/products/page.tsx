"use client";
import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { PATH_URL_BACKEND } from "@/utils/constants";
import ModalCreateProduct from '@/components/layouts/modalCreateProduct';
import Swal from 'sweetalert2';

interface Product {
    id: number;
    descripcion: string;
    codigo: string;
    precioUnitario: number;
    codigoProductoSin: string;
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/item/obtener-items`);
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
                Swal.fire('Error', 'Error al obtener los productos', 'error');
            }
        };

        fetchProducts();
    }, []);

    const totalPages = Math.ceil(products.length / rowsPerPage);
    const paginatedProducts = products.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

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

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Productos</h2>

                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                className="border p-2 rounded-lg w-1/3"
                            />
                            <button
                                className="bg-sixthColor text-white py-2 px-4 rounded-lg hover:bg-thirdColor text-lg"
                                onClick={handleOpenModal}
                            >
                                Agregar Producto <FaPlus className="inline-block ml-2" />
                            </button>
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Descripción</th>
                                        <th className="px-6 py-4 font-bold">Precio Unitario</th>
                                        <th className="px-6 py-4 font-bold">Código Producto SIN</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-black">{product.descripcion}</p>
                                                    <p className="text-sm text-gray-600">Código: {product.codigo}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{product.precioUnitario} Bs.</td>
                                            <td className="px-6 py-4">{product.codigoProductoSin}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    <button
                                                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                                                    >
                                                        <FaTrashAlt className="text-black" />
                                                    </button>
                                                    <button
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
                                    className={`rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 ${currentPage === page ? 'bg-slate-800 text-white' : ''}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                </div>

                <ModalCreateProduct
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onProductCreated={(newProduct) => setProducts([...products, newProduct])}
                />
            </div>
        </div>
    );
};

export default ProductList;
