"use client";
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import CreateEditEnterpriseModal from '@/components/layouts/modalCreateEnterprise';

const EnterpriseList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnterprise, setSelectedEnterprise] = useState(null);

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
            <div className="flex flex-col w-full min-h-screen">
                {/* Header */}
                <Header />

                {/* Contenido principal */}
                <div className="p-6 bg-gray-50 h-screen w-full">
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

                    {/* Tabla de empresas */}
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
                            {/* Fila de empresa de ejemplo */}
                            <tr className="border-b">
                                <td className="px-4 py-4">1</td>
                                <td className="px-4 py-4">123456789</td>
                                <td className="px-4 py-4">Empresa XYZ</td>
                                <td className="px-4 py-4">3</td>
                                <td className="px-4 py-4">Calle Falsa 123</td>
                                <td className="px-4 py-4">Zona Norte</td>
                                <td className="px-4 py-4">+591 12345678</td>
                                <td className="px-4 py-4">La Paz</td>
                                <td className="px-4 py-4">Presencial</td>
                                <td className="px-4 py-4">
                                    <img src="/img/logo-empresa.jpg" alt="Logo Empresa" className="w-16 h-16 object-cover rounded-md" />
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
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="mt-4 flex justify-between">
                        <button className="text-gray-600">Previous</button>
                        <div className="space-x-2">
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">1</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">2</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">3</button>
                        </div>
                        <button className="text-gray-600">Next</button>
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
