"use client";
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import CreateEditEnterpriseModal from '@/components/layouts/modalCreateEnterprise';

interface Enterprise {
    id: number;
    nit: string;
    nombreEmpresa: string;
    sucursales: string;
    direccion: string;
    zona: string;
    telefono: string;
    ciudad: string;
    modalidad: string;
    logo: string;
}

const EnterpriseList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const enterprises = [
        { id: 1, nit: '123456789', nombreEmpresa: 'Empresa XYZ', sucursales: '3', direccion: 'Calle Falsa 123', zona: 'Zona Norte', telefono: '+591 12345678', ciudad: 'La Paz', modalidad: 'Presencial', logo: '/img/logo-empresa.jpg' },
        // Puedes añadir más empresas aquí...
    ];

    const totalPages = Math.ceil(enterprises.length / rowsPerPage);

    const paginatedEnterprises = enterprises.slice(
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

    const openModal = () => {
        setSelectedEnterprise(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEnterprise = (enterprise: Enterprise) => {
        console.log('Empresa guardada:', enterprise);
        closeModal();
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-grow">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Empresas</h1>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={openModal}
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-lg"
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
                                        <th className="px-6 py-4 font-bold">Empresa</th>
                                        <th className="px-6 py-4 font-bold">Sucursales</th>
                                        <th className="px-6 py-4 font-bold">Dirección</th>
                                        <th className="px-6 py-4 font-bold">Zona</th>
                                        <th className="px-6 py-4 font-bold">Teléfono</th>
                                        <th className="px-6 py-4 font-bold">Ciudad</th>
                                        <th className="px-6 py-4 font-bold">Modalidad</th>
                                        <th className="px-6 py-4 font-bold">Logo de la Empresa</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEnterprises.map((enterprise) => (
                                        <tr key={enterprise.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{enterprise.id}</td>
                                            <td className="px-6 py-4">{enterprise.nit}</td>
                                            <td className="px-6 py-4">{enterprise.nombreEmpresa}</td>
                                            <td className="px-6 py-4">{enterprise.sucursales}</td>
                                            <td className="px-6 py-4">{enterprise.direccion}</td>
                                            <td className="px-6 py-4">{enterprise.zona}</td>
                                            <td className="px-6 py-4">{enterprise.telefono}</td>
                                            <td className="px-6 py-4">{enterprise.ciudad}</td>
                                            <td className="px-6 py-4">{enterprise.modalidad}</td>
                                            <td className="px-6 py-4">
                                                <img src={enterprise.logo} alt={enterprise.nombreEmpresa} className="h-10 w-10" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    {/* Botón de Borrar */}
                                                    <button className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300">
                                                        <FaTrashAlt className="text-black" />
                                                    </button>
                                                    
                                                    {/* Botón de Editar */}
                                                    <button
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                                                        onClick={() => {
                                                            setSelectedEnterprise(enterprise);
                                                            openModal();
                                                        }}
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
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Next
                            </button>
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
                            </span>
                        </div>

                        <CreateEditEnterpriseModal
                            isOpen={isModalOpen}
                            onClose={closeModal}
                            onSave={handleSaveEnterprise}
                            enterprise={selectedEnterprise}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseList;
