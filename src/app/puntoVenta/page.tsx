"use client";
import React, { useState, useEffect } from 'react';
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";
import { FaEdit, FaPlus, FaSearch, FaTrashAlt } from 'react-icons/fa';
import ModalCreatePos from '@/components/layouts/modalCreatePos';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';


interface PuntoVenta {
    id: number;
    nombrePuntoVenta: string;
    tipoPuntoVenta: string;
    codigoPuntoVenta: string;
}

const PuntoVenta: React.FC = () => {
    const [customers, setCustomers] = useState<PuntoVenta[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCustomers, setFilteredCustomers] = useState<PuntoVenta[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedSucursal, setSelectedSucursal] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [puntoVentaDetail, setPuntoVentaDetail] = useState<PuntoVentaDetail | null>(null);
    const [tiposPuntoVenta, setTiposPuntoVenta] = useState<{ id: number; codigoClasificador: string; descripcion: string; }[]>([]);

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
                            console.log('Modo de contingencia aceptado.');
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
                    console.log('Modo de contingencia aceptado.');
                } else {
                    console.log('Modo de contingencia cancelado.');
                }
            });
        }
    };
    useEffect(() => {
        const fetchTiposPuntoVenta = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/parametro/tipo-punto-venta`);
                const data = await response.json();
                setTiposPuntoVenta(data);
            } catch (error) {
                console.error("Error al obtener tipos de punto de venta:", error);
            }
        };
        fetchTiposPuntoVenta();
    }, []);
    useEffect(() => {
        fetchPuntoVentas();
    }, []);

    useEffect(() => {
        const fetchPuntoVentas = async () => {
            try {
                const CodigoSucursal = localStorage.getItem('CodigoSucursal');
                const response = await fetch(`${PATH_URL_BACKEND}/operaciones/punto-venta/lista-siat/${CodigoSucursal}`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data.listaPuntosVentas || []);
                    setFilteredCustomers(data.listaPuntosVentas || []);
                } else {
                    throw new Error("Error al obtener la lista de puntos de venta");
                }
            } catch (error) {
                console.error("Error al obtener la lista de puntos de venta:", error);
            }
        };

        fetchPuntoVentas();
    }, []);


    const handleCreatePos = async (newPos) => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/operaciones/punto-venta/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPos),
            });

            if (response.ok) {
                await fetchPuntoVentas();
                const createdPos = await response.json();
                setCustomers([...customers, createdPos]);
                Swal.fire('Punto de Venta creado', 'El nuevo punto de venta ha sido registrado con éxito', 'success');
            } else {
                throw new Error('Error al registrar el punto de venta');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    useEffect(() => {
        checkServerCommunication();
    }, []);

    useEffect(() => {
        let filtered = customers;
    
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((customer) =>
                (customer.codigoPuntoVenta && String(customer.codigoPuntoVenta).toLowerCase().includes(lowerCaseSearchTerm)) ||
                (customer.nombrePuntoVenta && String(customer.nombrePuntoVenta).toLowerCase().includes(lowerCaseSearchTerm)) ||
                (customer.tipoPuntoVenta && String(customer.tipoPuntoVenta).toLowerCase().includes(lowerCaseSearchTerm))
            );
        }
    
        if (selectedSucursal) {
            filtered = filtered.filter((customer) => customer.sucursal?.nombre === selectedSucursal);
        }
    
        setFilteredCustomers(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedSucursal, customers]);
    
    
    
    
    

    const fetchPuntoVentas = async () => {
        try {
            const CodigoSucursal = localStorage.getItem('CodigoSucursal');
            const response = await fetch(`${PATH_URL_BACKEND}/operaciones/punto-venta/lista-siat/${CodigoSucursal}`);
            if (response.ok) {
                const data = await response.json();
                setCustomers(data.listaPuntosVentas || []);
                setFilteredCustomers(data.listaPuntosVentas || []);
            } else {
                throw new Error("Error al obtener la lista de puntos de venta");
            }
        } catch (error) {
            console.error("Error al obtener la lista de puntos de venta:", error);
        }
    };

    const totalPages = Math.ceil((filteredCustomers?.length || 0) / rowsPerPage);
    const paginatedCustomers = Array.isArray(filteredCustomers)
        ? filteredCustomers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        : [];

    const handleEditPuntoVenta = (id: number) => {
        console.log(`Editar punto de venta con id: ${id}`);
    };

    const handleDeletePuntoVenta = (id: number) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este punto de venta?");
        if (confirmDelete) {
            console.log(`Eliminar punto de venta con id: ${id}`);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
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

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-black">Lista de Puntos de Venta</h2>

                        <div className="flex justify-end mb-2">
                            
                            <ModalCreatePos
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                                onPosCreated={handleCreatePos}
                                tiposPuntoVenta={tiposPuntoVenta}
                            />

                        </div>

                        <div className="flex items-center mb-4 justify-between">
                            <div>
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border px-4  h-10 rounded-lg w-20"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <div className="flex justify-end">


                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por Codigo, Nombre o Tipo..."
                                        className="px-4 border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none h-10 rounded-lg w-full shadow-sm text-sm placeholder-gray-400 ml-3"
                                        style={{ width: "400px" }}
                                    />
                                    <FaSearch className="absolute right-3 text-gray-500 text-xl" />
                                </div>
                            </div>
                            <div className='flex'>
                            <button className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-lg"
                                onClick={handleOpenModal}>
                                Agregar Punto de Venta <FaPlus className="inline-block ml-2" />
                            </button>
                            </div>
                        </div>


                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Código</th>
                                        <th className="px-6 py-4 font-bold">Nombre del punto de venta</th>
                                        <th className="px-6 py-4 font-bold">Tipo de punto de venta</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{customer.codigoPuntoVenta}</td>
                                            <td className="px-6 py-4">{customer.nombrePuntoVenta}</td>
                                            <td className="px-6 py-4">{customer.tipoPuntoVenta}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    <button
                                                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                                                        onClick={() => console.log("Eliminar")}
                                                    >
                                                        <FaTrashAlt className="text-black" />
                                                    </button>
                                                    <button
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                                                        onClick={() => console.log("Editar")}
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
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                                >
                                    Ant.
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
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
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
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuntoVenta;
