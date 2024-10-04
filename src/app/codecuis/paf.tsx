"use client";

import Header from '@/components/commons/header';
import Sidebar from '@/components/commons/sidebar';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { PATH_URL_BACKEND } from '@/utils/constants';

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
    puntoVenta: PuntoVenta;
}

const CodeReceipt = () => {
    const [codes, setCodes] = useState<Code[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredCodes, setFilteredCodes] = useState<Code[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("Todos");
    const [selectedSucursal, setSelectedSucursal] = useState<string>("Todos");
    const [sucursales, setSucursales] = useState<string[]>([]);  // Lista de sucursales
    const [daysToExpire, setDaysToExpire] = useState<number | null>(null);
    const [rowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/codigos/cuis/activo/1`);
                if (response.ok) {
                    const data = await response.json();
                    const formattedData = data.map((code: any) => ({
                        id: code.id,
                        codigo: code.codigo,
                        fechaSolicitada: new Date(code.fechaSolicitada).toLocaleString(),
                        fechaVigencia: new Date(code.fechaVigencia).toLocaleString(),
                        vigente: code.vigente,
                        puntoVenta: code.puntoVenta
                    }));
                    setCodes(formattedData);

                    // Extraer las sucursales únicas
                    const uniqueSucursales = Array.from(
                        new Set(formattedData.map((code: Code) => code.puntoVenta.sucursal.nombre))
                    );
                    setSucursales(uniqueSucursales);
                } else {
                    console.error('Error fetching codes');
                }
            } catch (error) {
                console.error('Error fetching codes:', error);
            }
        };
        fetchCodes();
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
                if (filterStatus === "Vencidos") {
                    return expirationDate < currentDate && !code.vigente;
                } else if (filterStatus === "No Vencidos") {
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

        // Filtrar por sucursal seleccionada
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

    const handleEditCode = (id: number) => {
        console.log(`Editar código con id: ${id}`);
    };

    const handleDeleteCode = (id: number) => {
        console.log(`Eliminar código con id: ${id}`);
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

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">CUIS</h1>
                        
                        <div className="mb-4 flex space-x-4 text-black">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Vencidos">Vencidos</option>
                                <option value="No Vencidos">No Vencidos</option>
                                <option value="Por Vencer">Por Vencer</option>
                            </select>

                            {filterStatus === "Por Vencer" && (
                                <select
                                    value={daysToExpire || ""}
                                    onChange={(e) => setDaysToExpire(e.target.value ? Number(e.target.value) : null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="5">5 días</option>
                                    <option value="10">10 días</option>
                                    <option value="15">15 días</option>
                                </select>
                            )}

                            <select
                                value={selectedSucursal}
                                onChange={(e) => setSelectedSucursal(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Todos">Todas las sucursales</option>
                                {sucursales.map((sucursal, index) => (
                                    <option key={index} value={sucursal}>
                                        {sucursal}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Buscar por codigo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-200 text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Codigo</th>
                                        <th className="px-6 py-4 font-bold">Fecha de solicitud</th>
                                        <th className="px-6 py-4 font-bold">Fecha de vigencia</th>
                                        <th className="px-6 py-4 font-bold">Estado</th>
                                        <th className="px-6 py-4 font-bold">Sucursal</th>
                                        <th className="px-6 py-4 font-bold">Departamento</th>
                                        <th className="px-6 py-4 font-bold">Municipio</th>
                                        <th className="px-6 py-4 font-bold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCodes.length > 0 ? (
                                        paginatedCodes.map(code => (
                                            <tr key={code.id}>
                                                <td className="border px-6 py-4">{code.codigo}</td>
                                                <td className="border px-6 py-4">{code.fechaSolicitada}</td>
                                                <td className="border px-6 py-4">{code.fechaVigencia}</td>
                                                <td className="border px-6 py-4">{getStatus(code.fechaVigencia, code.vigente)}</td>
                                                <td className="border px-6 py-4">{code.puntoVenta.sucursal.nombre}</td>
                                                <td className="border px-6 py-4">{code.puntoVenta.sucursal.departamento}</td>
                                                <td className="border px-6 py-4">{code.puntoVenta.sucursal.municipio}</td>
                                                <td className="border px-6 py-4">
                                                    <button
                                                        onClick={() => handleEditCode(code.id)}
                                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCode(code.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="border px-6 py-4 text-center">
                                                No se encontraron datos.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-center space-x-2">
                            {getPageNumbers().map((number) => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`px-4 py-2 border border-gray-300 rounded-md ${currentPage === number
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-black hover:bg-gray-100"
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeReceipt;
