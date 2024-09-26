"use client";
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import CreateEditEnterpriseModal from '@/components/layouts/modalCreateEnterprise';

const EnterpriseList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const enterprises = [
        { id: 1, nit: '123456789', nombreEmpresa: 'Empresa XYZ', sucursales: '3', direccion: 'Calle Falsa 123', zona: 'Zona Norte', telefono: '+591 12345678', ciudad: 'La Paz', modalidad: 'Presencial', logo: '/img/logo-empresa.jpg' },
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

    const handleSaveEnterprise = (enterprise) => {
        console.log('Empresa guardada:', enterprise);
        closeModal();
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Contenido principal */}
            <div className="flex flex-col flex-grow">
                {/* Header */}
                <Header />

                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Empresas</h1>

                        {/* Botón para agregar empresa */}
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={openModal}
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-lg"
                            >
                                Agregar Empresa
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">ID</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">NIT</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Empresa</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Sucursales</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Dirección</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Zona</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Teléfono</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Ciudad</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Modalidad</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Logo de la Empresa</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEnterprises.map((enterprise) => (
                                        <tr key={enterprise.id} className="border-b">
                                            <td className="border px-4 py-4">{enterprise.id}</td>
                                            <td className="border px-4 py-4">{enterprise.nit}</td>
                                            <td className="border px-4 py-4">{enterprise.nombreEmpresa}</td>
                                            <td className="border px-4 py-4">{enterprise.sucursales}</td>
                                            <td className="border px-4 py-4">{enterprise.direccion}</td>
                                            <td className="border px-4 py-4">{enterprise.zona}</td>
                                            <td className="border px-4 py-4">{enterprise.telefono}</td>
                                            <td className="border px-4 py-4">{enterprise.ciudad}</td>
                                            <td className="border px-4 py-4">{enterprise.modalidad}</td>
                                            <td className="border px-4 py-4">
                                                <img src={enterprise.logo} alt="Logo Empresa" className="w-16 h-16 object-cover rounded-md" />
                                            </td>
                                            <td className="px-4 py-4 flex space-x-2">
                                                <button className="text-blue-500 hover:text-blue-700">
                                                    <FaEdit />
                                                </button>
                                                <button className="text-red-500 hover:text-red-700">
                                                    <FaTrashAlt />
                                                </button>
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
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para agregar/editar empresa */}
            <CreateEditEnterpriseModal
                isOpen={isModalOpen}
                onClose={closeModal}
                enterprise={selectedEnterprise || { id: 0, nit: '', nombreEmpresa: '', sucursales: '', direccion: '', zona: '', telefono: '', ciudad: '', modalidad: '', logo: '' }}
                onSave={handleSaveEnterprise}
            />
        </div>
    );
};

export default EnterpriseList;
