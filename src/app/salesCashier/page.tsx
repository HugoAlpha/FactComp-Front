"use client";
import React, { useState, useEffect } from 'react';
import { FaUser, FaCreditCard, FaCartPlus, FaEdit, FaTrash, FaList, FaTable } from 'react-icons/fa';
import { IoReturnDownBack } from "react-icons/io5";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ModalVerifySale from "../../components/layouts/modalVerifySale";
import ReceiptOptionsModal from "../../components/layouts/modalReceiptOptions";
import Link from 'next/link';
import { PATH_URL_BACKEND } from '@/utils/constants';
import { GrDocumentConfig } from "react-icons/gr";
import CreateEditClientModal from '@/components/layouts/modalCreateEditClient';
import ModalCreateProduct from '@/components/layouts/modalCreateProduct';

interface UserRole {
    role: 'ADMIN' | 'CAJERO';
}

const Sales = () => {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaleSuccessful, setIsSaleSuccessful] = useState(false);
    const [saleDetails, setSaleDetails] = useState<SaleDetails | null>(null);
    const [globalDiscount, setGlobalDiscount] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);
    const [globalDiscountApplied, setGlobalDiscountApplied] = useState(0);
    const [globalDiscountHistory, setGlobalDiscountHistory] = useState<string[]>([]);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [facturaData, setFacturaData] = useState<FacturaData | null>(null);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [currentCustomer, setCurrentCustomer] = useState<Customer>({
        id: 0,
        nombreRazonSocial: '',
        numeroDocumento: '',
        complemento: '',
        codigoTipoDocumentoIdentidad: 0,
        codigoCliente: '',
        email: '',
    });
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [userRole, setUserRole] = useState<UserRole['role']>('CAJERO');
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserRole = () => {
            const storedRole = localStorage.getItem('userRole');
            if (storedRole === 'ADMIN' || storedRole === 'CAJERO') {
                setUserRole(storedRole);
            }
        };
        fetchUserRole();
    }, []);
    
    interface Product {
        id: number;
        name: string;
        price: number;
        discount: number;
        img: string;
        quantity?: number;
        totalPrice?: number;
        descripcion: string;
        precioUnitario: number;
        codigoProductoSin: number;
        codigo: string;
        unidadMedida: number;
    }

    

    interface SaleDetails {
        total: number;
        client: string;
        paidAmount: number;
        change: number;
        orderNumber: string;
    }

    interface FacturaData {
        numeroFactura: string;
        nitEmisor: string;
        razonSocialEmisor: string;
        municipio: string;
        nombreRazonSocial: string;
        numeroDocumento: string;
        complemento: string;
        codigoMetodoPago: string;
        numeroTarjeta: string;
        montoTotal: number;
        montoTotalSujetoIva: number;
        cuf: string;
    }

    interface SaleData {
        client: string;
        total: number;
        numeroFactura: number;
    }

    

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/item/obtener-items`);
            if (response.ok) {
                const data: Product[] = await response.json();
                const formattedProducts: Product[] = data.map((item) => ({
                    id: item.id,
                    name: item.descripcion,
                    price: item.precioUnitario,
                    discount: item.discount || 0,
                    img: '/images/apple-watch.png',
                    descripcion: item.descripcion,
                    precioUnitario: item.precioUnitario,
                    codigoProductoSin: item.codigoProductoSin,
                    quantity: 1,
                    totalPrice: item.precioUnitario,
                    codigo: item.codigo,
                    unidadMedida: item.unidadMedida,
                }));
    
                setProducts(formattedProducts);
            } else {
                Swal.fire('Error', 'Error al obtener productos', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);
    


    const updateDiscount = (id: number, value: string) => {
        console.log(`Actualizando descuento del producto con id: ${id}, nuevo valor: ${value}`);
        const updatedProducts = selectedProducts.map((item: Product) => {
            if (item.id === id) {
                const newDiscount = value ? parseFloat(value) : 0;
                const subtotal = item.price * item.quantity!;
                const newTotalPrice = subtotal - newDiscount;

                return {
                    ...item,
                    discount: newDiscount,
                    totalPrice: newTotalPrice > 0 ? newTotalPrice : 0
                };
            }
            return item;
        });
        setSelectedProducts(updatedProducts);
        calculateTotal(updatedProducts);
    };

    const updateProductInList = (updatedProduct: Product) => {
        const updatedProducts = products.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item
        );
        setProducts(updatedProducts);
        const updatedSelectedProducts = selectedProducts.map((item) =>
            item.id === updatedProduct.id ? { ...item, price: updatedProduct.price, totalPrice: item.quantity! * updatedProduct.price } : item
        );
        setSelectedProducts(updatedSelectedProducts);
        calculateTotal(updatedSelectedProducts);
    };

    const calculateTotal = (updatedProducts: Product[]) => {
        const subtotal = updatedProducts.reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0);
        const totalWithGlobalDiscount = subtotal - globalDiscountApplied;
        setTotal(totalWithGlobalDiscount > 0 ? totalWithGlobalDiscount : 0);
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        setIsEditModalOpen(true);
    };

    const applyGlobalDiscount = () => {
        if (discountApplied) {
            Swal.fire('Error', 'Ya se ha aplicado un descuento global.', 'error');
            return;
        }

        const discountValue = parseFloat(globalDiscount);
        if (isNaN(discountValue) || discountValue <= 0) {
            Swal.fire('Error', 'Ingrese un descuento válido.', 'error');
            return;
        }

        const newTotal = total - discountValue;

        if (newTotal < 0) {
            Swal.fire('Error', 'El descuento global no puede hacer que el total sea menor que 0.', 'error');
            return;
        }

        setOriginalTotal(total);
        setTotal(newTotal);
        setDiscountApplied(true);

        setGlobalDiscountHistory((prevHistory) => [
            ...prevHistory,
            `Descuento aplicado: Bs ${discountValue.toFixed(2)}`
        ]);

        setGlobalDiscount('');
    };

    const removeGlobalDiscount = () => {
        if (!discountApplied) {
            Swal.fire('Error', 'No hay descuento global aplicado para eliminar.', 'error');
            return;
        }

        setTotal(originalTotal);
        setDiscountApplied(false);
        setGlobalDiscountHistory([]);

        Swal.fire('Éxito', 'Descuento global eliminado.', 'success');
    };

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addProduct = (product: Product) => {
        const existingProduct = selectedProducts.find((item: Product) => item.id === product.id);
        let updatedProducts;
        if (existingProduct) {
            updatedProducts = selectedProducts.map((item: Product) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity! + 1, totalPrice: (item.quantity! + 1) * item.price }
                    : item
            );
        } else {
            updatedProducts = [...selectedProducts, { ...product, quantity: 1, totalPrice: product.price }];
        }
        setSelectedProducts(updatedProducts);
        calculateTotal(updatedProducts);
    };

    const removeProduct = (id: number) => {
        const updatedProducts = selectedProducts.filter((item) => item.id !== id);
        setSelectedProducts(updatedProducts);
        setTotal(updatedProducts.reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0));
        calculateTotal(updatedProducts);
    };

    const increaseQuantity = (id: number) => {
        const updatedProducts = selectedProducts.map((item) =>
            item.id === id
                ? {
                    ...item,
                    quantity: (item.quantity ?? 1) + 1,
                    totalPrice: ((item.quantity ?? 1) + 1) * item.price - item.discount,
                }
                : item
        );
        setSelectedProducts(updatedProducts);
        calculateTotal(updatedProducts);
    };

    const decreaseQuantity = (id: number) => {
        const updatedProducts = selectedProducts.map((item) =>
            item.id === id && (item.quantity ?? 1) > 1
                ? {
                    ...item,
                    quantity: (item.quantity ?? 1) - 1,
                    totalPrice: ((item.quantity ?? 1) - 1) * item.price - item.discount,
                }
                : item
        );
        setSelectedProducts(updatedProducts);
        calculateTotal(updatedProducts);
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

    const handleSaleSuccess = async (data: { client: string; total: number; numeroFactura: number }) => {
        if (!data.numeroFactura) {
            console.error("El número de factura no está definido.");
            Swal.fire('Error', 'No se pudo obtener el número de factura.', 'error');
            return;
        }

        try {
            const response = await fetch(`${PATH_URL_BACKEND}/factura/${data.numeroFactura}`);

            if (response.ok) {
                const facturaData = await response.json();
                console.log(facturaData);

                setSaleDetails({
                    client: facturaData.nombreRazonSocial || data.client,
                    total: facturaData.montoTotal || data.total,
                    paidAmount: 0,
                    change: 0,
                    orderNumber: facturaData.numeroFactura.toString(),
                });

                setFacturaData(facturaData);
                setIsSaleSuccessful(true);
                setIsModalOpen(false);

            } else {
                console.error('Error al obtener los detalles de la factura');
                Swal.fire('Error', 'No se pudo obtener los detalles de la factura.', 'error');
            }

        } catch (error) {
            console.error('Error al obtener la factura:', error);
            Swal.fire('Error', 'Ocurrió un error inesperado.', 'error');
        }
    };

    const handleNewOrder = () => {
        setSelectedProducts([]);
        setTotal(0);
        setIsSaleSuccessful(false);
    };

    const handleGoToDashboard = () => {
        const route = '/dashboardCashier';
        window.location.href = route;
    };

    const handleOpenReceiptModal = () => {
        setIsReceiptModalOpen(true);
    };

    const handleCloseReceiptModal = () => {
        setIsReceiptModalOpen(false);
    };

    const handlePrintReceipt = () => {
        console.log("Imprimir recibo");

        setIsReceiptModalOpen(false);
    };

    const handleDownloadReceipt = () => {
        console.log("Descargar recibo");

        setIsReceiptModalOpen(false);
    };

    const handleOpenClientModal = () => {
        setIsClientModalOpen(true);
    };

    const handleCloseClientModal = () => {
        setIsClientModalOpen(false);
        setCurrentCustomer({
            id: 0,
            nombreRazonSocial: '',
            numeroDocumento: '',
            complemento: '',
            codigoTipoDocumentoIdentidad: 0,
            codigoCliente: '',
            email: '',
        });
    };

    const handleSaveCustomer = (savedCustomer: Customer) => {

        console.log('Cliente guardado:', savedCustomer);
        handleCloseClientModal();
    };

    const formattedSelectedProducts = selectedProducts.map((product) => ({
        id: product.id,
        nombre: product.name,
        precio: product.price,
        cantidad: product.quantity ?? 1,
        discount: product.discount
    }));

    
    const refreshProductList = async () => {
        await fetchProducts();
    };

    return (
        <div className="bg-white flex p-6 space-x-6 h-screen">
            {!isSaleSuccessful ? (
                <>
                    {/* Productos Seleccionados */}
                    <div className="flex flex-col w-1/3" style={{ maxHeight: '90vh' }}>
                        <div className='flex justify-between mb-6'>
                            <h2 className="text-xl font-bold mr-5 place-content-center">Productos Seleccionados</h2>
                            <button
                                    onClick={handleGoToDashboard}
                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded-lg flex items-center space-x-2"
                                >
                                    <IoReturnDownBack className="text-xl" />
                                <span>Volver al inicio</span>
                            </button> 
                        </div>
                        <div className="text-black h-3/5 overflow-y-auto">
                            
                            <table className="min-w-full bg-white ">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Producto</th>
                                        <th className="px-4 py-2">Cantidad</th>
                                        <th className="px-4 py-2">Descuento</th>
                                        <th className="px-4 py-2">Precio</th>
                                        <th className="px-4 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product) => (
                                        <tr key={product.id} className="text-sm">
                                            <td className="px-4 py-2">{product.name}</td>
                                            <td className="px-4 py-2">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button 
                                                    onClick={() => decreaseQuantity(product.id)} 
                                                    className="bg-gray-100 hover:bg-slate-300 text-gray-700 font-bold w-7 h-7 rounded-full focus:outline-none flex items-center justify-center"
                                                >
                                                    -
                                                </button>
                                                
                                                <input
                                                    type="text"
                                                    className="w-12 text-center border border-gray-200 rounded-md bg-transparent focus:outline-none"
                                                    value={product.quantity}
                                                    readOnly
                                                />
                                                
                                                <button 
                                                    onClick={() => increaseQuantity(product.id)} 
                                                    className="bg-gray-100 hover:bg-slate-300 text-gray-700 font-bold w-7 h-7 rounded-full focus:outline-none flex items-center justify-center"
                                                >
                                                    +
                                                </button>
                                                </div>

                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    className="w-16 text-center border rounded-md hover:border-gray-200"
                                                    value={product.discount !== undefined ? product.discount.toString() : ''} // Mostramos el descuento actual
                                                    min="0"
                                                    onChange={(e) => updateDiscount(product.id, e.target.value)}
                                                />
                                            </td>

                                            <td className="px-4 py-2">{product.totalPrice !== undefined ? product.totalPrice.toFixed(2) : '0.00'}</td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => removeProduct(product.id)}
                                                    className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 transtion-colors">
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-black">
                            <div className="mt-4 text-lg font-bold">Total: Bs {total.toFixed(2)}</div>

                            <div className="text-sm text-gray-500 mt-2">
                                {globalDiscountHistory.map((discount, index) => (
                                    <div key={index}>{discount}</div>
                                ))}
                            </div>
                            <div className="mt-4 space-y-3 w-full">
                                <button
                                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-lg w-full"
                                    onClick={handleOpenClientModal}
                                    >
                                    <FaUser className="mr-2" /> Agregar nuevo cliente
                                </button>

                                <button
                                    onClick={handleOpenModal}
                                    className="flex items-center justify-center bg-thirdColor hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg w-full"
                                >
                                    <FaCreditCard className="mr-2" /> Pagar
                                </button>

                                <input
                                    type="number"
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                    placeholder="Descuento Global"
                                    value={globalDiscount}
                                    onChange={(e) => setGlobalDiscount(e.target.value)}
                                    disabled={discountApplied}
                                />

                                <button
                                    className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
                                    onClick={applyGlobalDiscount}
                                    disabled={discountApplied}
                                >
                                    Aplicar Descuento Global
                                </button>

                                {discountApplied && (
                                    <button
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg"
                                        onClick={removeGlobalDiscount}
                                    >
                                        Eliminar Descuento Global
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-black w-2/3" style={{ maxHeight: "90vh" }}>
                        <div>
                            <h2 className="text-xl font-bold mb-8">Agregar Productos</h2>
                            
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="mb-4 p-2 border rounded w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Tabs para cambiar la vista */}
                            <div className="w-full mb-4">
                                <div className="flex justify-end">
                                    <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1">
                                        <ul className="relative flex gap-x-1" role="tablist" aria-label="Tabs" aria-orientation="horizontal">
                                            <li className="z-30 flex-auto text-center">
                                                <button
                                                    type="button"
                                                    className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200 ${
                                                        viewMode === "grid" 
                                                        ? "bg-slate-700 text-white" 
                                                        : "bg-transparent text-gray-500 hover:bg-slate-300"
                                                    }`}
                                                    onClick={() => setViewMode("grid")}
                                                >
                                                    <FaTable className={`text-lg ${viewMode === "grid" ? "text-white" : "text-gray-500"}`} />
                                                </button>
                                            </li>
                                            <li className="z-30 flex-auto text-center">
                                                <button
                                                    type="button"
                                                    className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200 ${
                                                        viewMode === "list" 
                                                        ? "bg-slate-700 text-white" 
                                                        : "bg-transparent text-gray-500 hover:bg-slate-300"
                                                    }`}
                                                    onClick={() => setViewMode("list")}
                                                >
                                                    <FaList className={`text-lg ${viewMode === "list" ? "text-white" : "text-gray-500"}`} />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Vista Grid / List */}
                        <div className="max-h-[70vh] overflow-y-auto">
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-6 gap-4">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => addProduct(product)}
                                            className="relative cursor-pointer bg-white border rounded-lg p-2 shadow hover:bg-gray-100"
                                        >
                                            <img
                                                src={product.img}
                                                alt={product.name}
                                                className="h-24 w-full object-contain mb-2 transition-all duration-300 hover:scale-110"
                                            />
                                            <h3 className="text-xs font-semibold truncate">{product.name}</h3>
                                            <p className="text-sm font-bold">Bs {product.price}</p>
                                            <button
                                                className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 z-10"
                                                onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                                            >
                                                <FaEdit />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => addProduct(product)}
                                            className="cursor-pointer flex items-center bg-white border rounded-lg p-2 shadow transition-all duration-300 hover:bg-gray-100"
                                        >

                                            <div className="flex-grow">
                                                <h3 className="text-sm font-semibold">{product.name}</h3>
                                                <p className="text-sm font-bold">Bs {product.price}</p>
                                            </div>
                                            <button
                                                className="ml-4 text-blue-500 hover:text-blue-700 z-10"
                                                onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }}
                                            >
                                                <FaEdit />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <ModalCreateProduct
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onProductCreated={() => refreshProductList()}
                        product={productToEdit}
                    />

                    <ModalVerifySale
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        products={formattedSelectedProducts}
                        total={total}
                        onSuccess={(data) => handleSaleSuccess({
                            client: data.client,
                            total: data.total,
                            numeroFactura: data.numeroFactura
                        })}
                    />

                    <CreateEditClientModal
                        isOpen={isClientModalOpen}
                        onClose={handleCloseClientModal}
                        customer={currentCustomer}
                        onSave={handleSaveCustomer}
                    />

                </>
            ) : (
                <>
                    <div className="text-black w-full p-6">
                        <h2 className="text-3xl font-bold mb-6 text-center">Pago exitoso</h2>
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-2/3 pr-4">
                                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <p className="text-xl font-bold">Total: {Number(saleDetails?.total || 0).toFixed(2)} Bs.</p>
                                </div>
                                <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-between mb-6">
                                    <span>{saleDetails?.client || 'Correo cliente'}</span>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg flex items-center"
                                        onClick={handleOpenReceiptModal}
                                    >
                                        <GrDocumentConfig className="text-xl mr-2" />
                                        <span>Opciones de recibo</span>
                                    </button>
                                </div>
                                <ReceiptOptionsModal
                                    isOpen={isReceiptModalOpen}
                                    onClose={handleCloseReceiptModal}
                                    cuf={facturaData.cuf}
                                    numeroFactura={parseInt(facturaData.numeroFactura)}
                                />
                            </div>

                            {/* Resumen de la factura */}
                            {facturaData && (
                                <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
                                    <div className="text-center mb-6">
                                        <img src="/images/LogoIdAlpha.png" alt="logo" className=" mx-auto" />
                                        <p className="font-semibold">Orden #{facturaData.numeroFactura || '-'}</p>
                                    </div>

                                    <ul className="text-sm">
                                        <li className="flex justify-between">
                                            <span>NIT Emisor:</span>
                                            <span>{facturaData.nitEmisor || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Razón Social:</span>
                                            <span>{facturaData.razonSocialEmisor || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Municipio:</span>
                                            <span>{facturaData.municipio || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Nombre Cliente:</span>
                                            <span>{facturaData.nombreRazonSocial || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Número Documento:</span>
                                            <span>{facturaData.numeroDocumento || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Complemento:</span>
                                            <span>{facturaData.complemento || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Método de Pago:</span>
                                            <span>{facturaData.codigoMetodoPago || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Número Tarjeta:</span>
                                            <span>{facturaData.numeroTarjeta || '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Monto Total:</span>
                                            <span>{facturaData.montoTotal ? `${facturaData.montoTotal.toFixed(2)} Bs.` : '-'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Monto Total Sujeto a IVA:</span>
                                            <span>{facturaData.montoTotalSujetoIva ? `${facturaData.montoTotalSujetoIva.toFixed(2)} Bs.` : '-'}</span>
                                        </li>
                                    </ul>
                                    <hr className="my-4" />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span>{facturaData.montoTotal ? `${facturaData.montoTotal.toFixed(2)} Bs.` : '-'}</span>
                                    </div>
                                </div>
                            )}
                        </div>

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
                                className="bg-thirdColor hover:bg-fourthColor text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2"
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