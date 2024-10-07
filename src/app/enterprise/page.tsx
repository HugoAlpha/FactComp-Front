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
    const [rowsPerPage, setRowsPerPage] = useState(10);
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
                                onClick={() => openModal()}
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
                                        <th className="px-6 py-4 font-bold">Razón Social</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enterprises.map((enterprise) => (
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
                </div>
            </div>
        </div>
    );
};

export default EnterpriseList;
