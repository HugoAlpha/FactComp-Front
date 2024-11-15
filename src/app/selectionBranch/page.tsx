"use client";
import React, { useEffect, useState } from 'react';
import { FaBuilding } from "react-icons/fa";
import HeaderBranch from '@/components/commons/headerBranch';
import { PATH_URL_BACKEND } from "@/utils/constants";
import ModalContingency from '@/components/layouts/modalContingency';
import Swal from 'sweetalert2';
import Footer from '@/components/commons/footer';

const SelectionBranch = () => {
    const today = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);
    const [username, setUsername] = useState('Usuario no disponible');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const fetchBranches = async () => {
        try {
            const idEmpresa = parseInt(localStorage.getItem('idEmpresa') || '0', 10); 
            const response = await fetch(`${PATH_URL_BACKEND}/sucursales`);
            if (response.ok) {
                const data = await response.json();
                const filteredBranches = data.filter(branch => branch.empresa.id === idEmpresa);
                setBranches(filteredBranches);
                setFilteredBranches(filteredBranches);
            } else {
                Swal.fire('Error', 'No se pudo obtener la lista de sucursales', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error en la conexión con el servidor', 'error');
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = branches.filter(branch => branch.nombre.toLowerCase().includes(term));
        setFilteredBranches(filtered);
    };

    const handleSelectBranch = (id, codigo) => {
        localStorage.setItem('idSucursal', id);
        localStorage.setItem('CodigoSucursal', codigo);
        window.location.href = "/selectionPOS";
    };

    const handleConfirm = (eventoDescripcion: string) => {
        setIsContingencyModalOpen(false);
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

    const closeModal = () => {
        setIsContingencyModalOpen(false);
    };

    return (
        <div className="flex flex-col h-screen">
            <HeaderBranch />
            <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex justify-between items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Buscar por nombre de sucursal..."
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <span className="ml-4 text-gray-600 font-medium whitespace-nowrap">Usuario: {username}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {filteredBranches.map((branch) => (
                        <div key={branch.id} className="bg-white border border-gray-200 rounded-lg shadow p-6">
                            <FaBuilding className="w-7 h-7 text-gray-500 mb-3" />
                            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                                {branch.nombre}
                            </h5>
                            <p className="mb-3 font-normal text-gray-500">
                                {branch.municipio}<br />
                            </p>
                            <button
                                onClick={() => handleSelectBranch(branch.id, branch.codigo)}
                                className="inline-flex font-medium items-center text-blue-600 hover:underline"
                            >
                                Ingresar a sucursal
                                <svg
                                    className="w-3 h-3 ms-2.5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
            <ModalContingency 
                isOpen={isContingencyModalOpen} 
                onClose={closeModal} 
                onConfirm={handleConfirm} 
            />
        </div>
    );
};

export default SelectionBranch;
