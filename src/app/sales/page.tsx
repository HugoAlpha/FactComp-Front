"use client";
import React, { useState, useEffect } from 'react';
import { FaUser, FaCreditCard, FaCartPlus, FaEdit, FaTable, FaList } from 'react-icons/fa';
import { IoReturnDownBack } from "react-icons/io5";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import ModalVerifySale from "../../components/layouts/modalVerifySale";
import ReceiptOptionsModal from "../../components/layouts/modalReceiptOptions";
import { PATH_URL_BACKEND, PATH_URL_IMAGES } from '@/utils/constants';
import { GrDocumentConfig } from "react-icons/gr";
import CreateEditClientModal from '@/components/layouts/modalCreateEditClient';
import ModalCreateProduct from '@/components/layouts/modalCreateProduct';
import { GoHomeFill } from "react-icons/go";
import ModalAllClients from '@/components/layouts/modalAllClients';
import { FaTrash } from "react-icons/fa6";

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
    const [clients, setClients] = useState([]);
    const [clientSearchTerm, setClientSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isAllClientsModalOpen, setIsAllClientsModalOpen] = useState(false);
    const [appliedGlobalDiscount, setAppliedGlobalDiscount] = useState<number | null>(null);
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

    const hasZeroTotalProduct = selectedProducts.some(product => product.totalPrice === 0);

    	const tooltipMessage = currentCustomer.id === 0 && hasZeroTotalProduct
        ? 'Debe seleccionar un cliente y corregir los precios de los productos con total 0'
        : currentCustomer.id === 0
        ? 'Debe seleccionar un cliente primero'
        : hasZeroTotalProduct
        ? 'Alguno de los precios de los productos seleccionados es 0, corrija y continúe con el pago'
        : '';

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

    const fetchClients = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/api/clientes`);
            if (response.ok) {
                const data = await response.json();
                setClients(data);
                setFilteredClients(data);
            } else {
                Swal.fire('Error', 'Error al obtener la lista de clientes', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    const fetchProducts = async () => {
        try {
            const productResponse = await fetch(`${PATH_URL_BACKEND}/item/obtener-items`);
            const productsData: Product[] = await productResponse.json();

            const imageResponse = await fetch(`${PATH_URL_IMAGES}/images`);
            const imagesData = await imageResponse.json();

            const unidadMedidaResponse = await fetch(`${PATH_URL_BACKEND}/parametro/unidad-medida`);
            const unidadMedidaData = await unidadMedidaResponse.json();

            const formattedProducts: Product[] = productsData.map((item) => {
                const image = imagesData.find((img) => img.itemId === item.id);
                const unidadMedida = unidadMedidaData.find((um) => String(um.codigoClasificador) === String(item.unidadMedida));

                return {
                    id: item.id,
                    name: item.descripcion,
                    price: item.precioUnitario,
                    discount: item.discount || 0,
                    img: image ? `${PATH_URL_IMAGES}/images/${image.id}` : '/images/caja.png',
                    descripcion: item.descripcion,
                    precioUnitario: item.precioUnitario,
                    codigoProductoSin: item.codigoProductoSin,
                    quantity: 1,
                    totalPrice: item.precioUnitario,
                    codigo: item.codigo,
                    unidadMedida: item.unidadMedida,
                    imageId: image ? image.id : null,
                    unidadMedidaDescripcion: unidadMedida ? unidadMedida.descripcion : 'No disponible'
                };
            });

            setProducts(formattedProducts);
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };


    useEffect(() => {
        fetchClients();
        fetchProducts();
    }, []);

    useEffect(() => {
        setFilteredClients(
            clients.filter(client =>
                client.nombreRazonSocial.toLowerCase().includes(clientSearchTerm.toLowerCase())
            )
        );
    }, [clientSearchTerm, clients]);

    const handleClientSelect = (clientId) => {
        const selectedClient = clients.find(client => client.id === parseInt(clientId));
        if (selectedClient) {
            setCurrentCustomer(selectedClient);
            setDropdownOpen(false);
        }
    };

    const updateDiscount = (id: number, value: string) => {
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
            item.id === updatedProduct.id ? { ...item, price: updatedProduct.precioUnitario } : item
        );
        setProducts(updatedProducts);
        const updatedSelectedProducts = selectedProducts.map((item) => {
            if (item.id === updatedProduct.id) {
                const newTotalPrice = (item.quantity ?? 1) * updatedProduct.precioUnitario;
                return {
                    ...item,
                    price: updatedProduct.precioUnitario,
                    totalPrice: !isNaN(newTotalPrice) ? newTotalPrice : 0,
                };
            }
            return item;
        });
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
    
        if (newTotal < 1) {
            Swal.fire('Error', 'El descuento global no puede hacer que el total sea menor que 1.', 'error');
            return;
        }
    
        setOriginalTotal(total);
        setTotal(newTotal);
        setDiscountApplied(true);
        setAppliedGlobalDiscount(discountValue); 
    
        setGlobalDiscountHistory((prevHistory) => [
            ...prevHistory,
            `Descuento aplicado: Bs ${discountValue.toFixed(2)}`,
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
    
                const items = selectedProducts.map((product) => ({
                    descripcion: product.descripcion,
                    cantidad: product.quantity || 1,
                    precioUnitario: product.price,
                    total: product.totalPrice || product.price
                }));
    
                setSaleDetails({
                    client: facturaData.nombreRazonSocial || data.client,
                    total: facturaData.montoTotal || (total - appliedGlobalDiscount!), 
                    paidAmount: 0,
                    change: 0,
                    orderNumber: facturaData.numeroFactura.toString(),
                });
    
                const totalAfterDiscounts = selectedProducts.reduce(
                    (acc, product) => acc + (product.totalPrice || 0),
                    0
                );
                
                setFacturaData({
                    ...facturaData,
                    items,
                    montoTotal: totalAfterDiscounts - (appliedGlobalDiscount || 0),
                });                
    
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
        setGlobalDiscount(''); 
        setDiscountApplied(false); 
        setGlobalDiscountHistory([]); 
        setAppliedGlobalDiscount(null);
    };

    const handleGoToDashboard = () => {
        const route = '/dashboard';
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

    const handleProductUpdate = (updatedProduct: Product) => {
        updateProductInList(updatedProduct); 
        setIsEditModalOpen(false);
    };
    

    const handleSaveCustomer = (savedCustomer: Customer) => {
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(value);
    };

    const handleOpenAllClientsModal = () => {
        setIsAllClientsModalOpen(true);
    };
    
    const handleCloseAllClientsModal = () => {
        setIsAllClientsModalOpen(false);
    };

    const handleClientSelectFromModal = (selectedClient) => {
        setCurrentCustomer(selectedClient);
        setIsAllClientsModalOpen(false);
    };


    return (
        <div className="flex flex-col min-h-screen"> 
            <div className="flex-grow flex p-6 space-x-6 bg-white">
                {!isSaleSuccessful ? (
                    <>
                        {/* Productos Seleccionados */}
                        <div className="flex flex-col w-1/3 " style={{ maxHeight: '90vh' }}>    
                            
                            <div className='flex justify-between mb-6'>
                                <h2 className="text-xl font-bold mr-5 place-content-center">Productos Seleccionados</h2>
                                <button
                                    onClick={handleGoToDashboard}
                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded-lg flex items-center space-x-2"
                                >
                                    <GoHomeFill className="text-xl" />
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
                                                    <input
                                                        type="text"
                                                        className="w-12 text-center border border-gray-200 rounded-md bg-transparent focus:outline-none"
                                                        value={product.quantity}
                                                        readOnly
                                                    />
                                                    <div className="flex flex-col space-y-1">
                                                        <button
                                                            onClick={() => increaseQuantity(product.id)}
                                                            className="bg-gray-100 hover:bg-slate-300 text-gray-700 font-bold w-5 h-5 rounded-full focus:outline-none flex items-center justify-center"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => decreaseQuantity(product.id)}
                                                            className="bg-gray-100 hover:bg-slate-300 text-gray-700 font-bold w-5 h-5 rounded-full focus:outline-none flex items-center justify-center"
                                                        >
                                                            -
                                                        </button>
                                                    </div>
                                                </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="w-16 text-center border rounded-md hover:border-gray-200"
                                                        value={product.discount !== undefined ? product.discount.toString() : ''}
                                                        min="0"
                                                        onChange={(e) => updateDiscount(product.id, e.target.value)}
                                                    />
                                                </td>

                                                <td className="px-4 py-2">{product.totalPrice !== undefined ? formatCurrency(product.totalPrice) : 'Bs. 0.00'}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => removeProduct(product.id)}
                                                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 transtion-colors">
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-sm text-gray-500 mt-2">
                                    {globalDiscountHistory.map((discount, index) => (
                                        <div key={index}>{discount}</div>
                                    ))}
                                </div>
                            <div className="text-black">
                                <div className="mt-4 text-lg font-bold">Total: {formatCurrency(total)}</div>

                                
                                <div className="mt-4 space-y-3 w-full">

                                    <div className="mt-4 space-y-3 w-full">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-lg w-full"
                                            >
                                                {currentCustomer?.nombreRazonSocial
                                                    ? `${currentCustomer.nombreRazonSocial} - ${currentCustomer.numeroDocumento}`
                                                    : 'Selección de cliente'}
                                            </button>

                                            {dropdownOpen && (
                                                <div className="absolute z-50 bg-white shadow-lg rounded mt-2 w-full">
                                                    <ul className="bg-white border border-gray-300 rounded-b max-h-48 overflow-y-auto">
                                                        {clients.slice(0, 5).map((client) => (
                                                            <li key={client.id}>
                                                                <button
                                                                    type="button"
                                                                    className="block px-2 py-1 text-left w-full hover:bg-gray-100"
                                                                    onClick={() => {
                                                                        setCurrentCustomer(client);
                                                                        setDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    {client.nombreRazonSocial} - {client.numeroDocumento}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <button
                                                        type="button"
                                                        className="block w-full text-center bg-gray-200 hover:bg-gray-300 py-2"
                                                        onClick={() => {
                                                            setDropdownOpen(false);
                                                            handleOpenAllClientsModal();
                                                        }}
                                                    >
                                                        Buscar más - Crear cliente
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleOpenModal}
                                        className={`flex items-center justify-center ${
                                            currentCustomer.id === 0 || hasZeroTotalProduct ? 'bg-gray-300' : 'bg-thirdColor hover:bg-opacity-90'
                                        } text-white font-bold py-3 px-4 rounded-lg w-full`}
                                        disabled={currentCustomer.id === 0 || hasZeroTotalProduct}
                                        title={tooltipMessage}
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

                        <div className="text-black w-2/3 border-l-4 border-black" style={{ maxHeight: "90vh" }}>
                            <div className="ml-2">
                                <h2 className="text-xl font-bold mb-8 ">Agregar Productos</h2>
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
                                                        className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200 ${viewMode === "grid"
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
                                                        className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200 ${viewMode === "list"
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
                            <div className="max-h-[70vh] overflow-y-auto ml-2">
                                {viewMode === "grid" ? (
                                    <div className="grid grid-cols-5 gap-4">
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
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/images/caja.png";
                                                    }}
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
                                        {/* Títulos para las columnas */}
                                        <div className="flex items-center bg-gray-200 p-2 rounded-lg shadow">
                                            <div className="flex-grow">
                                                <h3 className="text-sm font-bold">Nombre y Precio del producto</h3>
                                            </div>
                                            <div className="justify-end">
                                                <h3 className="text-sm font-bold">Unidad de medida</h3>
                                            </div>
                                        </div>

                                        {/* Lista de productos */}
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
                                                <div className="justify-end">
                                                    <p className="text-sm font-bold">{product.unidadMedidaDescripcion}</p>
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
                            onProductCreated={handleProductUpdate}
                            refreshProducts={refreshProductList}
                            product={productToEdit}
                        />

                        <ModalVerifySale
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            products={formattedSelectedProducts}
                            total={total}
                            client={{
                                ...currentCustomer, 
                                codigoTipoDocumentoIdentidad: currentCustomer.codigoTipoDocumentoIdentidad 
                            }}
                            globalDiscount={appliedGlobalDiscount} 
                            onSuccess={(data) =>
                                handleSaleSuccess({
                                    client: data.client,
                                    total: data.total,
                                    numeroFactura: data.numeroFactura,
                                })
                            }
                        />

                        <CreateEditClientModal
                            isOpen={isClientModalOpen}
                            onClose={handleCloseClientModal}
                            customer={currentCustomer}
                            onSave={handleSaveCustomer}
                        />

                        <ModalAllClients
                            isOpen={isAllClientsModalOpen}
                            onClose={handleCloseAllClientsModal}
                            onSelectClient={handleClientSelectFromModal} 
                        />

                    </>
                ) : (
                    <>
                        <div className="text-black w-full p-6 flex flex-col items-center">
                            <h2 className="text-3xl font-bold mb-6 text-center">Pago exitoso</h2>

                            {/* Total y Opciones de recibo */}
                            <div className="bg-gray-100 p-4 rounded-lg mb-4 w-2/3 text-center">
                                <p className="text-xl font-bold">
                                    Total: {Number(facturaData?.montoTotal || saleDetails?.total || 0).toFixed(2)} Bs.
                                </p>
                            </div>
                            <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-between mb-6 w-2/3">
                                <span>{saleDetails?.client || 'Correo cliente'}</span>
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg flex items-center"
                                    onClick={handleOpenReceiptModal}
                                >
                                    <GrDocumentConfig className="text-xl mr-2" />
                                    <span>Opciones de recibo</span>
                                </button>
                            </div>

                            {/* Resumen de la factura */}
                            {facturaData && (
                                <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
                                    <div className="text-center mb-4">
                                        <img src="/images/LogoIdAlpha.png" alt="logo" className="mx-auto mb-2" />
                                        <p className="text-lg font-semibold">Orden #{facturaData.numeroFactura || '-'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold">Vendedor</h2>
                                            <p>NIT Emisor: {facturaData.nitEmisor || '-'}</p>
                                            <p>Razón Social: {facturaData.razonSocialEmisor || '-'}</p>
                                            <p>Municipio: {facturaData.municipio || '-'}</p>
                                        </div>
                                        <div className="text-right">
                                            <h2 className="text-lg font-semibold">Cliente</h2>
                                            <p>Nombre Cliente: {facturaData.nombreRazonSocial || '-'}</p>
                                            <p>Número Documento: {facturaData.numeroDocumento || '-'}</p>
                                            <p>Complemento: {facturaData.complemento || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-2 border-b text-left">Descripción</th>
                                                    <th className="px-4 py-2 border-b text-right">Cantidad</th>
                                                    <th className="px-4 py-2 border-b text-right">Precio Unitario</th>
                                                    <th className="px-4 py-2 border-b text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(facturaData.items || []).map((item, index) => (
                                                    <tr key={index} className="text-sm">
                                                        <td className="px-4 py-2 border-b">{item.descripcion || 'Sin descripción'}</td>
                                                        <td className="px-4 py-2 border-b text-right">{item.cantidad || '0'}</td>
                                                        <td className="px-4 py-2 border-b text-right">{item.precioUnitario ? `${item.precioUnitario.toFixed(2)} Bs.` : '0.00 Bs.'}</td>
                                                        <td className="px-4 py-2 border-b text-right">{item.total ? `${item.total.toFixed(2)} Bs.` : '0.00 Bs.'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <div className="w-64">
                                            <div className="flex justify-between mb-2">
                                                <span>Monto Total:</span>
                                                <span>{facturaData.montoTotal ? `${facturaData.montoTotal.toFixed(2)} Bs.` : '-'}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total:</span>
                                                <span>{facturaData.montoTotal ? `${facturaData.montoTotal.toFixed(2)} Bs.` : '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modales */}
                            <ReceiptOptionsModal
                                isOpen={isReceiptModalOpen}
                                onClose={handleCloseReceiptModal}
                                cuf={facturaData?.cuf || ''}
                                numeroFactura={parseInt(facturaData?.numeroFactura || '0')}
                            />

                            {/* Botones de acción */}
                            <div className="flex justify-between mt-8 w-2/3">
                                <button
                                    onClick={handleGoToDashboard}
                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded-lg flex items-center space-x-2"
                                >
                                    <IoReturnDownBack className="text-xl" />
                                    <span>Volver al inicio</span>
                                </button>

                                <button
                                    onClick={handleNewOrder}
                                    className="bg-principalColor hover:bg-firstColor text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2"
                                >
                                    <FaCartPlus className="text-xl" />
                                    <span>Nueva orden</span>
                                </button>
                            </div>
                        </div>
                    </>

                )}
            </div>
            <footer className="bg-gray-100 text-center py-4 mt-0">
                <p className="text-gray-500">© 2024 Alpha Systems S.R.L. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Sales;
