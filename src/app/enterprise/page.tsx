"use client";
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import CreateEditEnterpriseModal from '@/components/layouts/modalCreateEnterprise';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';


interface Enterprise {
    id: number;
    nit: string;
    razonSocial: string;
}

const EnterpriseList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnterprises();
    }, []);

    const fetchEnterprises = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/empresa`);
            const data = await response.json();
            setEnterprises(data);
        } catch (error) {
            console.error('Error fetching enterprises:', error);
        } finally {
            setLoading(false);
        }
    };

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
            } else {
                fetchEnterprises();
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
        checkServerCommunication();
    }, []);

    const createEnterprise = async (enterprise: Omit<Enterprise, 'id'>) => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/empresa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enterprise),
            });
            if (response.ok) {
                fetchEnterprises();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "La empresa fue creada con éxito.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error creating enterprise:', error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "No se pudo crear la empresa",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const updateEnterprise = async (id: number, enterprise: Omit<Enterprise, 'id'>) => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/empresa/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enterprise),
            });
            if (response.ok) {
                fetchEnterprises();
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "La empresa fue actualizada con éxito.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error updating enterprise:', error);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "No se pudo actualizar la empresa",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const deleteEnterprise = async (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${PATH_URL_BACKEND}/empresa/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        fetchEnterprises();
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "La empresa fue eliminada.",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } catch (error) {
                    console.error('Error deleting enterprise:', error);
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "No se pudo eliminar la empresa",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        });
    };

    const openModal = (enterprise: Enterprise | null = null) => {
        setSelectedEnterprise(enterprise);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEnterprise = (enterprise: Enterprise) => {
        if (enterprise.id) {
            updateEnterprise(enterprise.id, enterprise);
        } else {
            createEnterprise(enterprise);
        }
        closeModal();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    const getPageNumbers = () => {
        const totalPages = Math.ceil(enterprises.length / rowsPerPage);
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
    const totalPages = Math.ceil(enterprises.length / rowsPerPage);
    const indexOfLastEnterprise = currentPage * rowsPerPage;
    const indexOfFirstEnterprise = indexOfLastEnterprise - rowsPerPage;
    const currentEnterprises = enterprises.slice(indexOfFirstEnterprise, indexOfLastEnterprise);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-grow">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Empresas</h1>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border p-2 rounded-lg w-20"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <button
                                onClick={() => openModal()}
                                className="bg-sixthColor text-white py-2 px-4 rounded-lg hover:bg-thirdColor text-lg"
                            >
                                Agregar Empresa
                            </button>
                        </div>


                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">ID</th>
                                        <th className="px-6 py-4 font-bold">NIT</th>
                                        <th className="px-6 py-4 font-bold">Razón Social</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEnterprises.map((enterprise) => (
                                        <tr key={enterprise.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{enterprise.id}</td>
                                            <td className="px-6 py-4">{enterprise.nit}</td>
                                            <td className="px-6 py-4">{enterprise.razonSocial}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    <button
                                                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                                                        onClick={() => deleteEnterprise(enterprise.id)}
                                                    >
                                                        <FaTrashAlt className="text-black" />
                                                    </button>
                                                    <button
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                                                        onClick={() => openModal(enterprise)}
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

                        <CreateEditEnterpriseModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            onSave={handleSaveEnterprise}
                            enterprise={selectedEnterprise || { id: 0, nit: '', razonSocial: '' }}
                        />
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
        </div>
    );
};

export default EnterpriseList;
