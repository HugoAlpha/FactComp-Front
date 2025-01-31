"use client";

import Header from '@/components/commons/header';
import Sidebar from '@/components/commons/sidebar';
import { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { PATH_URL_BACKEND } from '@/utils/constants';
import CashierSidebar from '@/components/commons/cashierSidebar';

import Swal from 'sweetalert2';
import ModalContingency from '@/components/layouts/modalContingency';
import Footer from '@/components/commons/footer';

interface PuntoVenta {
    id: number;
    codigo: number;
    nombre: string;
    sucursal: {
        id: number;
        codigo: number;
        nombre: string;
        departamento: string;
        municipio: string;
        direccion: string;
        telefono: string;
        empresa: {
            id: number;
            nit: number;
            razonSocial: string;
        };
    };
}

interface Code {
    id: number;
    codigo: string;
    fechaSolicitada: string;
    fechaVigencia: string;
    vigente: boolean;
}

const CodeReceipt = () => {
    const [codes, setCodes] = useState<Code[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredCodes, setFilteredCodes] = useState<Code[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("Todos");
    const [selectedSucursal, setSelectedSucursal] = useState<string>("Todos");
    const [sucursales, setSucursales] = useState<string[]>([]);
    const [daysToExpire, setDaysToExpire] = useState<number | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState<boolean>(false);

    const openContingencyModal = () => setIsContingencyModalOpen(true);
    const closeContingencyModal = () => setIsContingencyModalOpen(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);


    const fetchCodes = async () => {
        try {
            const idPuntoVenta = localStorage.getItem('idPOS');
            const idSucursal = localStorage.getItem('idSucursal');
            const response = await fetch(`${PATH_URL_BACKEND}/codigos/cuis/activo/${idPuntoVenta}/${idSucursal}`);
            if (response.ok) {
                const data = await response.json();

                const formattedData = Array.isArray(data) ? data.map((code: any) => ({
                    id: code.id,
                    codigo: code.codigo,
                    fechaSolicitada: new Date(code.fechaSolicitada).toLocaleString(),
                    fechaVigencia: new Date(code.fechaVigencia).toLocaleString(),
                    vigente: code.vigente,
                })) : [{
                    id: data.id,
                    codigo: data.codigo,
                    fechaSolicitada: new Date(data.fechaSolicitada).toLocaleString(),
                    fechaVigencia: new Date(data.fechaVigencia).toLocaleString(),
                    vigente: data.vigente,
                }];

                formattedData.sort((a: Code, b: Code) => b.id - a.id);
                setCodes(formattedData);
            } else {
                console.error('Error fetching codes');
            }
        } catch (error) {
            console.error('Error fetching codes:', error);
        }
    };


    useEffect(() => {
        fetchCodes();
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
        let filtered = codes;

        if (searchTerm) {
            filtered = filtered.filter(code =>
                code.codigo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== "Todos") {
            const currentDate = new Date();
            filtered = filtered.filter(code => {
                const expirationDate = new Date(code.fechaVigencia);
                if (filterStatus === "Vencido") {
                    return expirationDate < currentDate && !code.vigente;
                } else if (filterStatus === "Vigente") {
                    return expirationDate >= currentDate && code.vigente;
                } else if (filterStatus === "Por Vencer") {
                    if (daysToExpire !== null) {
                        const daysLeft = Math.ceil((expirationDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                        return daysLeft > 0 && daysLeft <= daysToExpire;
                    }
                }
                return false;
            });
        }
        if (selectedSucursal !== "Todos") {
            filtered = filtered.filter(code => code.puntoVenta.sucursal.nombre === selectedSucursal);
        }
        setFilteredCodes(filtered);
        setCurrentPage(1);
    }, [searchTerm, filterStatus, selectedSucursal, codes, daysToExpire]);

    const totalPages = Math.ceil(filteredCodes.length / rowsPerPage);
    const paginatedCodes = filteredCodes.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

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

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const getStatus = (fechaVigencia: string, vigente: boolean) => {
        const currentDate = new Date();
        const expirationDate = new Date(fechaVigencia);

        if (!vigente) {
            return (
                <span className="px-2 py-1 rounded-full bg-red-100 text-red-600">
                    Vencido
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-600">
                    Vigente
                </span>
            );
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="flex min-h-screen">
            {userRole === 'ROLE_ADMIN' ? <Sidebar /> : <CashierSidebar />}
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">CUIS</h1>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 text-black space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                <div className="flex items-center">
                                    <label htmlFor="itemsPerPage" className="text-sm mr-2">Elementos por página:</label>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                                        className="border p-2 rounded-md w-20 h-10 text-sm focus:outline-none"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <label htmlFor="filterStatus" className="text-sm mr-2">Estado de código:</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="border p-2 rounded-md w-28 md:w-auto text-sm focus:outline-none"
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Vencido">Vencidos</option>
                                        <option value="Vigente">Vigentes</option>
                                        <option value="Por Vencer">Por Vencer</option>
                                    </select>

                                    {filterStatus === "Por Vencer" && (
                                        <div className="flex items-center ml-4">
                                            <p className="text-sm mr-2">Dentro de:</p>
                                            <select
                                                value={daysToExpire || ""}
                                                onChange={(e) => setDaysToExpire(e.target.value ? Number(e.target.value) : null)}
                                                className="border p-2 rounded-md w-20 text-sm focus:outline-none"
                                            >
                                                <option value="5">5 días</option>
                                                <option value="10">10 días</option>
                                                <option value="15">15 días</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <label htmlFor="selectedSucursal" className="text-sm mr-2">Sucursal:</label>
                                    <select
                                        value={selectedSucursal}
                                        onChange={(e) => setSelectedSucursal(e.target.value)}
                                        className="border p-2 rounded-md w-40 md:w-auto text-sm focus:outline-none"
                                    >
                                        <option value="Todos">Todas</option>
                                        {sucursales.map((sucursal, index) => (
                                            <option key={index} value={sucursal}>{sucursal}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Buscar por código..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <FaSearch className="absolute top-2.5 right-3 text-gray-500" />
                            </div>
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">

                                        <th className="px-6 py-4 font-bold">Código</th>
                                        <th className="px-6 py-4 font-bold">Fecha de solicitud</th>
                                        <th className="px-6 py-4 font-bold">Fecha de vigencia</th>
                                        <th className="px-6 py-4 font-bold">Estado</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCodes.length > 0 ? (
                                        paginatedCodes.map(code => (
                                            <tr key={code.id} className="border-b hover:bg-gray-50 text-black">
                                                <td className="px-6 py-4">{code.codigo}</td>
                                                <td className="px-6 py-4">{code.fechaSolicitada}</td>
                                                <td className="px-6 py-4">{code.fechaVigencia}</td>
                                                <td className="px-6 py-4">{getStatus(code.fechaVigencia, code.vigente)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center py-6 text-gray-500">
                                                No hay datos disponibles.
                                            </td>
                                        </tr>
                                    )}
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
                <Footer />
            </div>
            {isContingencyModalOpen && (
                <ModalContingency isOpen={isContingencyModalOpen} onClose={closeModal} />
            )}
        </div>
    );
};

export default CodeReceipt;
