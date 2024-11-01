"use client";
import React, { useEffect, useState } from 'react';
import { FaCashRegister } from "react-icons/fa6";
import HeaderPOS from '@/components/commons/headerPOS';
import { PATH_URL_BACKEND } from "@/utils/constants";
import ModalContingency from '@/components/layouts/modalContingency';
import Swal from 'sweetalert2';

const KanbanView = () => {
    const today = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [salesPoints, setSalesPoints] = useState([]);
    const [role, setRole] = useState<string | null>(null);
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);

    useEffect(() => {
        const userRole = localStorage.getItem("role");
        setRole(userRole);

        const fetchSalesPoints = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/operaciones/punto-venta/lista-bd`);
                if (response.ok) {
                    const data = await response.json();

                    if (userRole === "ROLE_USER") {
                        const companySalesPoints = data.filter(
                            (point) => point.sucursal.empresa.id === 1
                        );
                        setSalesPoints(companySalesPoints);
                    } else if (userRole === "ROLE_ADMIN") {
                        const selectedBranchId = localStorage.getItem('idSucursal');
                        const filteredSalesPoints = data.filter(
                            (point) => String(point.sucursal.id) === selectedBranchId
                        );
                        setSalesPoints(filteredSalesPoints);
                    }
                } else {
                    Swal.fire('Error', 'No se pudo obtener la lista de puntos de venta', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Error en la conexión con el servidor', 'error');
            }
        };

        fetchSalesPoints();
    }, []);

    const handleSelectSalesPoint = (id, codigo, sucursalId) => {
        localStorage.setItem('idPOS', id);
        localStorage.setItem('CodigoPOS', codigo);

        if (role === "ROLE_USER") {
            localStorage.setItem("idSucursal", sucursalId);
            window.location.href = "/dashboardCashier";
        } else if (role === "ROLE_ADMIN") {
            window.location.href = "/dashboard";
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

    const handleConfirm = (eventoDescripcion: string) => {
        console.log("Evento confirmado:", eventoDescripcion);
        setIsContingencyModalOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <HeaderPOS />
            <div className="flex flex-col min-h-screen bg-gray-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {salesPoints.map((point) => (
                        <div key={point.id} className="bg-white border border-gray-200 rounded-lg shadow p-6">
                            <FaCashRegister className="w-7 h-7 text-gray-500 mb-3" />
                            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                                {point.nombre}
                            </h5>
                            <p className="mb-3 font-normal text-gray-500">
                                {point.sucursal.nombre}<br />{today}
                            </p>
                            <button
                                onClick={() => handleSelectSalesPoint(point.id, point.codigo, point.sucursal.id)}
                                className="inline-flex font-medium items-center text-blue-600 hover:underline"
                            >
                                Ingresar a punto de venta
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
                <footer className="mt-auto text-center text-gray-500 py-4 border-t border-gray-200">
                    ALPHA SYSTEMS S.R.L. EBILL 2.0 2024 Derechos Reservados
                </footer>
            </div>
            <ModalContingency 
            isOpen={isContingencyModalOpen} 
            onClose={closeModal} 
            onConfirm={handleConfirm} 
            />
        </div>
    );
};

export default KanbanView;
