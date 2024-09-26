"use client";
import React, { useState } from 'react';
import { FaUser, FaCreditCard, FaCartPlus } from 'react-icons/fa';
import { IoReturnDownBack } from "react-icons/io5";
import { MdLocalPrintshop } from "react-icons/md";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ModalVerifySale from "../../components/layouts/modalVerifySale";
import { FaHome, FaUsers } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import Link from 'next/link';

const productsData = [
    { id: 1, name: 'Apple Watch Series 7', price: 599, img: '/images/apple-watch.png' },
    { id: 2, name: 'iMac 27', price: 2499, img: '/images/imac.png' },
    { id: 3, name: 'iPhone 12', price: 999, img: '/images/iphone-12.png' },
    { id: 4, name: 'iPad pro 11', price: 1199, img: '/images/ipad-11.png' },
    { id: 5, name: 'MacBook 13', price: 1499, img: '/images/macbook-13.png' },
    { id: 6, name: 'iPod Nano', price: 399, img: '/images/ipod-nano.png' },
    { id: 7, name: 'Airpods', price: 89, img: '/images/airpods.png' },
];

const Sales = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredProducts = productsData.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [isSaleSuccessful, setIsSaleSuccessful] = useState(false);
    const [saleDetails, setSaleDetails] = useState(null);

    const addProduct = (product) => {
        const existingProduct = selectedProducts.find((item) => item.id === product.id);
        let updatedProducts;
        if (existingProduct) {
            updatedProducts = selectedProducts.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
                    : item
            );
        } else {
            updatedProducts = [...selectedProducts, { ...product, quantity: 1, totalPrice: product.price }];
        }
        setSelectedProducts(updatedProducts);
        setTotal(updatedProducts.reduce((acc, curr) => acc + curr.totalPrice, 0));
    };

    const removeProduct = (id) => {
        const updatedProducts = selectedProducts.filter((item) => item.id !== id);
        setSelectedProducts(updatedProducts);
        setTotal(updatedProducts.reduce((acc, curr) => acc + curr.totalPrice, 0));
    };

    const increaseQuantity = (id) => {
        const updatedProducts = selectedProducts.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price } : item
        );
        setSelectedProducts(updatedProducts);
        setTotal(updatedProducts.reduce((acc, curr) => acc + curr.totalPrice, 0));
    };

    const decreaseQuantity = (id) => {
        const updatedProducts = selectedProducts.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.price }
                : item
        );
        setSelectedProducts(updatedProducts);
        setTotal(updatedProducts.reduce((acc, curr) => acc + curr.totalPrice, 0));
    };

    const handleOpenModal = () => {
        if (selectedProducts.length > 0) {
            setIsModalOpen(true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, selecciona al menos un producto.',
            });
        }
    };
    const handleSaleSuccess = (details) => {
        setSaleDetails(details);
        setIsSaleSuccessful(true);
        setIsModalOpen(false);
    };

    const handleNewOrder = () => {
        setSelectedProducts([]);
        setTotal(0);
        setIsSaleSuccessful(false);
    };

    const handleGoToDashboard = () => {
        window.location.href = '/dashboard';
    };

    return (
        <div className="bg-white flex p-6 space-x-6 h-screen">
            {!isSaleSuccessful ? (
                <>
                    {/* Productos Seleccionados */}
                    <div className="text-black w-1/3 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                        <h2 className="text-xl font-bold mb-4">Productos Seleccionados</h2>
                        <table className="min-w-full bg-white ">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Producto</th>
                                    <th className="px-4 py-2">Cantidad</th>
                                    <th className="px-4 py-2">Precio</th>
                                    <th className="px-4 py-2">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.map((product) => (
                                    <tr key={product.id} className="text-sm">
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => decreaseQuantity(product.id)}>-</button>
                                            <input
                                                type="text"
                                                className="w-12 text-center mx-2 border"
                                                value={product.quantity}
                                                readOnly
                                            />
                                            <button onClick={() => increaseQuantity(product.id)}>+</button>
                                        </td>
                                        <td className="px-4 py-2">${product.totalPrice.toFixed(2)}</td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => removeProduct(product.id)} className="text-red-500">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-lg font-bold mt-16">Total: ${total.toFixed(2)}</div>

                        {/* Dialpad */}
                        <div className="mt-4">
                            <div className="mr-4">
                                <div className="mb-2">
                                    <button className="flex items-center justify-center bg-gray-100 text-black font-bold py-2 px-4 rounded-lg w-full">
                                        <FaUser className="mr-2" /> Cliente
                                    </button>
                                </div>
                                <div className="mb-2">
                                    <button
                                        onClick={handleOpenModal}
                                        className="flex items-center justify-center bg-thirdColor text-white font-bold py-2 px-4 rounded-lg w-full"
                                    >
                                        <FaCreditCard className="mr-2" /> Pagar
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((item) => (
                                    <button key={item} className="bg-gray-300 hover:bg-gray-400 text-2xl font-bold p-4 rounded-lg">
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Agregar Productos */}
                    <div className="text-black w-2/3 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                        <h2 className="text-xl font-bold mb-8">Agregar Productos</h2>
                        <div data-dial-init className="fixed top-6 right-6 group">
                            <button
                                type="button"
                                className="flex items-center justify-center text-white bg-thirdColor rounded-full w-14 h-14 hover:bg-fourthColor dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="w-5 h-5 transition-transform group-hover:rotate-45"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                >
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                </svg>
                                <span className="sr-only">Open actions menu</span>
                            </button>

                            <div className="flex flex-col items-center hidden mt-4 space-y-2 group-hover:flex">
                                {/* Enlace a Dashboard */}
                                <Link
                                    href="/dashboard"
                                    className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                                >
                                    <FaHome className="w-5 h-5" />
                                    <span className="sr-only">Dashboard</span>
                                </Link>

                                {/* Enlace a Client List */}
                                <Link
                                    href="/clientList"
                                    className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                                >
                                    <FaUsers className="w-5 h-5" />
                                    <span className="sr-only">Client List</span>
                                </Link>

                                {/* Enlace a Products */}
                                <Link
                                    href="/products"
                                    className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                                >
                                    <MdInventory className="w-5 h-5" />
                                    <span className="sr-only">Products</span>
                                </Link>
                            </div>
                        </div>
                        {/* Barra de búsqueda */}
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="mb-4 p-2 border rounded w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="flex mb-4 space-x-4">
                            <button className="bg-gray-200 p-2 rounded">All</button>
                            <button className="bg-gray-200 p-2 rounded">Watches</button>
                            <button className="bg-gray-200 p-2 rounded">Computers</button>
                            <button className="bg-gray-200 p-2 rounded">Phones</button>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addProduct(product)}
                                    className="cursor-pointer bg-white border rounded-lg p-2 shadow hover:bg-gray-100"
                                >
                                    <img src={product.img} alt={product.name} className="h-24 w-full object-contain mb-2 transition-all duration-300 hover:scale-110" />
                                    <h3 className="text-xs font-semibold truncate">{product.name}</h3>
                                    <p className="text-sm font-bold">${product.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ModalVerifySale */}
                    <ModalVerifySale
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        products={selectedProducts}
                        total={total}
                        onSuccess={handleSaleSuccess}
                    />
                </>
            ) : (
                <>
                    {/* Resumen de la Venta */}
                    <div className="text-black w-full p-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">Pago exitoso</h2>
                        <div className="flex justify-between items-start mb-8">
                            {/* Detalles de la venta */}
                            <div className="w-2/3 pr-4">
                                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <p className="text-xl font-bold">Total: {Number(saleDetails?.total || 0).toFixed(2)} Bs.</p>
                                </div>
                                <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-between mb-6">
                                    <span>{saleDetails?.client || 'Correo cliente'}</span>
                                    <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg flex items-center">
                                        <MdLocalPrintshop className="text-xl" />
                                        <span>Imprimir recibo</span>
                                    </button>
                                </div>
                            </div>

                            {/* Resumen de productos */}
                            <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
                                <div className="text-center mb-6">
                                    <img src="/images/LogoIdAlpha.png" alt="logo" className="w-50 h-40 mx-auto" />
                                    <p className="font-semibold">Orden #{saleDetails?.orderNumber || '0001'}</p>
                                </div>
                                <ul className="text-sm">
                                    {selectedProducts.map((product) => (
                                        <li key={product.id} className="flex justify-between">
                                            <span>{product.name} - {product.quantity}x</span>
                                            <span>{product.totalPrice.toFixed(2)} Bs.</span>
                                        </li>
                                    ))}
                                </ul>
                                <hr className="my-4" />
                                <div className="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span>{Number(saleDetails?.total || 0).toFixed(2)} Bs.</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span>Efectivo:</span>
                                    <span>{Number(saleDetails?.paidAmount || 0).toFixed(2)} Bs.</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span>Cambio:</span>
                                    <span>{Number(saleDetails?.change || 0).toFixed(2)} Bs.</span>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acciones */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={handleGoToDashboard}
                                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-3 px-6 rounded-lg flex items-center space-x-2"
                            >
                                <IoReturnDownBack className="text-xl" />
                                <span>Volver al inicio</span>
                            </button>

                            <button
                                onClick={handleNewOrder}
                                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2"
                            >
                                <FaCartPlus className="text-xl" />
                                <span>Nueva orden</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sales;
