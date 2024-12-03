"use client";
import React, { useState, useEffect } from 'react';
import {FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { PATH_URL_BACKEND, PATH_URL_IMAGES } from "@/utils/constants";
import ModalCreateProduct from '@/components/layouts/modalCreateProduct';
import Swal from 'sweetalert2';
import CashierSidebar from '@/components/commons/cashierSidebar';
import ModalContingency from '@/components/layouts/modalContingency';
import Footer from '@/components/commons/footer';
import Image from 'next/image';

interface Image {
    id: number;
    itemId: number;
}

interface UnidadMedidaOption {
    codigoClasificador: string;  
    descripcion: string;
    
}
interface Product {
    id: number;
    descripcion: string;
    codigo: string;
    precioUnitario: number;
    codigoProductoSin: string;
    unidadMedida: string;
    imageUrl?: string;
    unidadMedidaDescripcion?: string;
}




const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    //const [productsWithUnitDescription, setProductsWithUnitDescription] = useState<Product[]>([]);


    useEffect(() => {
        const fetchUserRole = () => {
            const storedRole = localStorage.getItem('role');
            if (storedRole === 'ROLE_ADMIN' || storedRole === 'ROLE_USER') {
                setUserRole(storedRole);
            }
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchProductsAndImages = async () => {
            try {
                const productResponse = await fetch(`${PATH_URL_BACKEND}/item/obtener-items`);
                const productsData: Product[] = await productResponse.json();
                const sortedProductsData = productsData.sort((a, b) => b.id - a.id);
    
                const imageResponse = await fetch(`${PATH_URL_IMAGES}/images`);
                const imagesData = await imageResponse.json();
    
                const unidadMedidaResponse = await fetch(`${PATH_URL_BACKEND}/parametro/unidad-medida`);
                const unidadMedidaData: UnidadMedidaOption[] = await unidadMedidaResponse.json();
    
                const updatedProducts = sortedProductsData.map(product => {
                    const image = imagesData.find((img: Image) => img.itemId === product.id);
                    const unidadMedida = unidadMedidaData.find(um => String(um.codigoClasificador) === String(product.unidadMedida));
    
                    return {
                        ...product,
                        imageUrl: image ? `${PATH_URL_IMAGES}/images/${image.id}` : '/images/caja.png',
                        imageId: image ? image.id : null,
                        unidadMedidaDescripcion: unidadMedida ? unidadMedida.descripcion : 'No disponible'
                    };
                });
    
                setProducts(updatedProducts);
            } catch (error) {
                console.error('Error al obtener productos, imágenes o unidades de medida:', error);
            }
        };
    
        fetchProductsAndImages();
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
                            setIsContingencyModalOpen(true);
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
                    setIsContingencyModalOpen(true);
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
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredProducts = products.filter((product) =>
    (product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo?.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    //const handlePrevPage = () => {
    //    if (currentPage > 1) {
    //        setCurrentPage(currentPage - 1);
    //    }
    //};

    //const handleNextPage = () => {
    //    if (currentPage < totalPages) {
    //        setCurrentPage(currentPage + 1);
    //    }
    //};

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 4;
    
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
    
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    
        return pageNumbers;
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setSelectedProduct(product);
        } else {
            setSelectedProduct(null);
        }
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleProductCreatedOrUpdated = (updatedProduct: Product) => {
        if (selectedProduct) {
            setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
        } else {
            setProducts([updatedProduct, ...products]);
        }
        handleCloseModal();
        refreshProducts();
    };

    const refreshProducts = async () => {
        try {
            const productResponse = await fetch(`${PATH_URL_BACKEND}/item/obtener-items`);
            const productsData: Product[] = await productResponse.json();

            const imageResponse = await fetch(`${PATH_URL_IMAGES}/images`);
            const imagesData = await imageResponse.json();

            const unidadMedidaResponse = await fetch(`${PATH_URL_BACKEND}/parametro/unidad-medida`);
            const unidadMedidaData: UnidadMedidaOption[] = await unidadMedidaResponse.json();

            const updatedProducts = productsData.map(product => {
                const image = imagesData.find((img: Image) => img.itemId === product.id);
                const unidadMedida = unidadMedidaData.find(um => String(um.codigoClasificador) === String(product.unidadMedida));

                return {
                    ...product,
                    imageUrl: image ? `${PATH_URL_IMAGES}/images/${image.id}` : '/images/caja.png',
                    unidadMedidaDescripcion: unidadMedida ? unidadMedida.descripcion : 'No disponible'
                };
            });

            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error al obtener productos, imágenes o unidades de medida:', error);
        }
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    /*
    const renderOperationButtons = (product: Product) => {
        return (
            <div className="flex">
                {userRole === 'ROLE_ADMIN' && (
                    <button
                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                    >
                        <FaTrashAlt className="text-black" />
                    </button>
                )}
                <button
                    className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                    onClick={() => handleOpenModal(product)}
                >
                    <FaEdit className="text-black" />
                </button>
            </div>
        );
    };
    */
    
    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const closeModal = () => setIsContingencyModalOpen(false);

    return (
        <div className="flex min-h-screen">
            {userRole === 'ROLE_ADMIN' ? <Sidebar /> : <CashierSidebar />}
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Productos</h2>
                        <div className="flex justify-end my-2">
                        </div>
                        <div className="flex justify-between mb-4">
                            <div>
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border p-2 rounded-lg w-20"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={40}>40</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <div className="relative flex items-center w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm text-sm placeholder-gray-400"
                                />
                                <FaSearch className="absolute right-4 text-gray-500 text-xl pointer-events-none" />
                            </div>
                            <button
                                className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-lg  h-10 flex items-center justify-center"
                                onClick={() => handleOpenModal()}
                            >
                                <span className="flex items-center">
                                    Agregar Producto <FaPlus className="inline-block ml-2" />
                                </span>
                            </button>
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Imagen</th>
                                        <th className="px-6 py-4 font-bold">Descripción</th>
                                        <th className="px-6 py-4 font-bold">Precio Unitario</th>
                                        <th className="px-6 py-4 font-bold">Código Producto SIN</th>
                                        <th className="px-6 py-4 font-bold">Unidad de Medida</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-4 py-4">
                                                <Image
                                                    src={product.imageUrl || '/images/caja.png'}  
                                                    alt={product.descripcion}
                                                    width={80}  
                                                    height={80} 
                                                    className="object-cover rounded-lg shadow-sm"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/images/caja.png";
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-black">{product.descripcion}</p>
                                                    <p className="text-sm text-gray-600">Código: {product.codigo}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{product.precioUnitario} Bs.</td>
                                            <td className="px-6 py-4">{product.codigoProductoSin}</td>
                                            <td className="px-6 py-4">{product.unidadMedidaDescripcion}</td>
                                            <td className="px-6 py-4">
                                            <button
                                                className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300 relative group"
                                                onClick={() => handleOpenModal(product)}
                                            >
                                                <FaEdit className="text-black" />
                                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                                                    Editar Producto
                                                </span>
                                            </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col items-center mt-6">
                            <div className="flex justify-center space-x-1 mb-2">
                                <button
                                    onClick={handleFirstPage}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Primero
                                </button>

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Ant.
                                </button>

                                {getPageNumbers().map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 ${currentPage === number ? 'bg-slate-800 text-white' : ''}`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Sig.
                                </button>
                                <button
                                    onClick={handleLastPage}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Último
                                </button>
                            </div>

                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-2">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalCreateProduct
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onProductCreated={handleProductCreatedOrUpdated}
                    refreshProducts={refreshProducts}
                    product={selectedProduct}
                />
                <Footer />
            </div>
            <ModalContingency
                isOpen={isContingencyModalOpen}
                onClose={closeModal}
                onConfirm={() => {}} 
            />
        </div>
    );
};

export default ProductList;
