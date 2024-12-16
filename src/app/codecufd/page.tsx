"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';
import ModalContingency from '@/components/layouts/modalContingency';
import CashierSidebar from '@/components/commons/cashierSidebar';
import { GrCatalog } from "react-icons/gr";

interface CUFD {
    id: number;
    codigo: string;
    fechaInicio: string;
    fechaVigencia: string;
    vigente: boolean;
}

const CUFDList = () => {
    const [cufds, setCUFDs] = useState<CUFD[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState<boolean>(false);


    useEffect(() => {
        const role = localStorage.getItem("role");
        //const idSucursal = localStorage.getItem("idSucursal");
        //const idPOS = localStorage.getItem("idPOS");
        setUserRole(role);
    }, []);

    const fetchCUFDs = useCallback(async () => {
        try {
            const idPuntoVenta = localStorage.getItem('idPOS');
            const response = await fetch(`${PATH_URL_BACKEND}/codigos/cufd/activo/${idPuntoVenta}`);
            const data = await response.json();
            const sortedData = data.sort((a: CUFD, b: CUFD) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
            const activeCUFD = sortedData.find((cufd: CUFD) => cufd.vigente === true);
            const otherCUFDs = sortedData.filter((cufd: CUFD) => cufd.vigente !== true);
            setCUFDs([activeCUFD, ...otherCUFDs]);
        } catch (error) {
            console.error('Error fetching CUFDs:', error);
        }
    }, []);


    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const filteredCUFDs = Array.isArray(cufds)
        ? cufds
            .filter((cufd) => cufd != null)
            .filter((cufd) =>
                Object.values(cufd)
                    .some((field) => field && field.toString().toLowerCase().includes(filter.toLowerCase()))
            )
        : [];

    const totalPages = Math.ceil(filteredCUFDs.length / rowsPerPage);
    const paginatedCUFDs = filteredCUFDs.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEmitCUFD = async () => {
        Swal.fire({
            title: 'Emitir CUFD',
            text: '¿Deseas emitir un nuevo CUFD?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Emitir',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const idPuntoVenta = localStorage.getItem('idPOS');
                    const idSucursal = localStorage.getItem('idSucursal');
                    const response = await fetch(`${PATH_URL_BACKEND}/codigos/obtener-cufd/${idPuntoVenta}/${idSucursal}`, {
                        method: 'POST',
                    });
                    if (response.ok) {
                        Swal.fire('¡Emitido!', 'El CUFD ha sido emitido.', 'success');
                        fetchCUFDs();
                    } else {
                        Swal.fire('Error', 'No se pudo emitir el CUFD.', 'error');
                    }
                } catch (error) {
                    console.error('Error al emitir el CUFD:', error);
                    Swal.fire('Error', 'Hubo un problema al emitir el CUFD.', 'error');
                }
            }
        });
    };

    const handleSynchronizeCatalog = async () => {
        Swal.fire({
            title: 'Sincronizar catalogos',
            text: '¿Sincronizar los catálogos?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sincronizar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const idPuntoVenta = localStorage.getItem('idPOS');
                    const idSucursal = localStorage.getItem('idSucursal');
                    const response = await fetch(`${PATH_URL_BACKEND}/sincronizar/catalogos/${idSucursal}/${idPuntoVenta}`, {
                        method: 'POST',
                    });
                    if (response.ok) {
                        Swal.fire('¡Sincronizado!', 'Catálogos sincronizados con éxito.', 'success');
                        fetchCUFDs();
                    } else {
                        Swal.fire('Error', 'No se pudo sincronizar los catálogos.', 'error');
                    }
                } catch (error) {
                    console.error('Error al sincronizar los catálogos:', error);
                    Swal.fire('Error', 'Hubo un problema con la sincronización.', 'error');
                }
            }
        });
    };

    const handleSynchronizeParameters = async () => {
        Swal.fire({
            title: 'Sincronizar parametros',
            text: '¿Sincronizar los parámetros??',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sincronizar',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const idPuntoVenta = localStorage.getItem('idPOS');
                    const idSucursal = localStorage.getItem('idSucursal');
                    const response = await fetch(`${PATH_URL_BACKEND}/sincronizar/parametros/${idSucursal}/${idPuntoVenta}`, {
                        method: 'POST',
                    });
                    if (response.ok) {
                        Swal.fire('¡Sincronizado!', 'Parametros sincronizados con éxito', 'success');
                        fetchCUFDs();
                    } else {
                        Swal.fire('Error', 'No se pudo sincronizar los parametros.', 'error');
                    }
                } catch (error) {
                    console.error('Error al sincronizar los parametros:', error);
                    Swal.fire('Error', 'Hubo un problema con la sincronización.', 'error');
                }
            }
        });
    };

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatus = (fechaVigencia: string, vigente: boolean) => {
        if (!vigente) {
            return (
                <span className="px-2 py-1 rounded-full bg-red-100 text-red-600">
                    Inactivo
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-600">
                    Activo
                </span>
            );
        }
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchCUFDs();
    }, [fetchCUFDs]);

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const closeModal = () => {
        setIsContingencyModalOpen(false);
    };



    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {userRole === 'ROLE_ADMIN' ? <Sidebar /> : <CashierSidebar />}

            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-700">Registros de CUFD</h2>

                        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-4">
                            <div className="flex items-center mb-4 md:mb-0">
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border p-2 rounded-lg w-20 h-10 text-sm"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="relative flex items-center w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
                                <input
                                    type="text"
                                    placeholder="Buscar CUFD por id o estado..."
                                    className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm text-sm placeholder-gray-400 h-10"
                                    value={filter}
                                    onChange={handleFilterChange}
                                />
                                <FaSearch className="absolute right-3 text-gray-500 text-xl pointer-events-none" />
                            </div>

                            <button
                                className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-base md:text-lg h-10 flex items-center justify-center"
                                onClick={handleSynchronizeCatalog}
                            >
                                <span className="flex items-center">
                                    Sincronizar Catálogo
                                    <GrCatalog className="inline-block ml-2 text-sm md:text-base" />
                                </span>
                            </button>

                            <button
                                className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-base md:text-lg h-10 flex items-center justify-center"
                                onClick={handleSynchronizeParameters}
                            >
                                <span className="flex items-center">
                                    Sincronizar Parámetros
                                    <FaPlus className="inline-block ml-2 text-sm md:text-base" />
                                </span>
                            </button>

                            <button
                                className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-base md:text-lg h-10 flex items-center justify-center"
                                onClick={handleEmitCUFD}
                            >
                                <span className="flex items-center">
                                    Emitir CUFD
                                    <FaPlus className="inline-block ml-2 text-sm md:text-base" />
                                </span>
                            </button>

                        </div>


                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">ID</th>
                                        <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">CUFD</th>
                                        <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">Fecha/Hora Emisión</th>
                                        <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">Fecha/Hora Vencimiento</th>
                                        <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCUFDs.map((cufd) => (
                                        <tr key={cufd.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{cufd.id}</td>
                                            <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{cufd.codigo}</td>
                                            <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{formatDate(cufd.fechaInicio)}</td>
                                            <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{formatDate(cufd.fechaVigencia)}</td>
                                            <td className="border px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{getStatus(cufd.fechaVigencia, cufd.vigente)}</td>
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
            <ModalContingency
                isOpen={isContingencyModalOpen}
                onClose={closeModal}
                onConfirm={() => { }}
            />
        </div>
    );
};

export default CUFDList;
