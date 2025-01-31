"use client";
import React, { useEffect, useState } from "react";
import { FaCashRegister, FaPlus } from "react-icons/fa6";
import HeaderPOS from "@/components/commons/headerPOS";
import { PATH_URL_BACKEND } from "@/utils/constants";
import ModalContingency from "@/components/layouts/modalContingency";
import ModalCreatePos from "@/components/layouts/modalCreatePos";
import Swal from "sweetalert2";
import { FaList, FaTable } from "react-icons/fa";
import Footer from "@/components/commons/footer";

const KanbanView = () => {
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [salesPoints, setSalesPoints] = useState([]);
  const [filteredSalesPoints, setFilteredSalesPoints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);
  const [isCreatePosModalOpen, setIsCreatePosModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [username, setUsername] = useState("Usuario no disponible");
  const [tiposPuntoVenta, setTiposPuntoVenta] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const fetchSalesPoints = async () => {
    try {
      const userRole = localStorage.getItem("role");
      let response;

      if (userRole === "ROLE_USER") {
        response = await fetch(`${PATH_URL_BACKEND}/operaciones/punto-venta/lista-bd`);
      } else if (userRole === "ROLE_ADMIN") {
        const codigoSucursal = localStorage.getItem("CodigoSucursal");
        const idEmpresa = localStorage.getItem("idEmpresa");
        response = await fetch(
          `${PATH_URL_BACKEND}/operaciones/punto-venta/lista-bd/${codigoSucursal}/${idEmpresa}`
        );
      }

      if (response && response.ok) {
        const data = await response.json();
        setSalesPoints(data);
        setFilteredSalesPoints(data);
      } else {
        Swal.fire("Error", "No se pudo obtener la lista de puntos de venta", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error en la conexión con el servidor", "error");
    }
  };

  const fetchTiposPuntoVenta = async () => {
    try {
      const response = await fetch(`${PATH_URL_BACKEND}/parametro/tipo-punto-venta`);
      if (response.ok) {
        const data = await response.json();
        setTiposPuntoVenta(data);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo obtener los tipos de punto de venta", "error");
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
    fetchSalesPoints();
    fetchTiposPuntoVenta();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = salesPoints.filter((point) =>
      point.nombre.toLowerCase().includes(term)
    );
    setFilteredSalesPoints(filtered);
  };

  const handleSelectSalesPoint = (id, codigo, sucursal) => {
    localStorage.setItem("idPOS", id);
    localStorage.setItem("CodigoPOS", codigo);

    if (role === "ROLE_USER") {
      if (sucursal && sucursal.id !== undefined && sucursal.codigo !== undefined) {
        localStorage.setItem("idSucursal", sucursal.id);
        localStorage.setItem("CodigoSucursal", sucursal.codigo);
      }
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
            title: "La comunicación con impuestos falló",
            text: "¿Desea entrar en modo de contingencia?",
            icon: "error",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            customClass: {
              confirmButton: "bg-red-500 text-white px-4 py-2 rounded-md",
              cancelButton: "bg-blue-500 text-white px-4 py-2 rounded-md",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              setIsContingencyModalOpen(true);
            }
          });
        } else {
          console.error("Error de comunicación con el servidor:", response.statusText);
        }
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  useEffect(() => {
    checkServerCommunication();
  }, []);

  const closeModal = () => {
    setIsContingencyModalOpen(false);
  };

  const closeCreatePosModal = () => {
    setIsCreatePosModalOpen(false);
  };

  const handleConfirm = (eventoDescripcion: string) => {
    setIsContingencyModalOpen(false);
  };

  const handleCreatePos = async (newPos) => {
    try {
      const response = await fetch(`${PATH_URL_BACKEND}/operaciones/punto-venta/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPos),
      });

      if (response.ok) {
        Swal.fire("Éxito", "El punto de venta fue creado correctamente", "success");
        fetchSalesPoints();
      } else {
        Swal.fire("Error", "No se pudo crear el punto de venta", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error al registrar el punto de venta", "error");
    }
  };

    return (
        <div className="flex flex-col h-screen">
            <HeaderPOS />
            <div className="flex flex-col flex-grow bg-gray-50 p-6 overflow-auto">
                <div className="w-full mb-4 flex justify-between items-center">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Buscar por nombre de punto de venta..."
                        className="w-full max-w-md p-2 border border-gray-300 rounded-lg"
                    />
                    <span className="ml-4 text-gray-600 font-medium">Usuario: {username}</span>
                    {role === "ROLE_ADMIN" && (
                        <button
                            className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-lg ml-4 flex items-center"
                            onClick={() => setIsCreatePosModalOpen(true)}
                        >
                            <FaPlus className="mr-2" /> Registrar Punto de Venta
                        </button>
                    )}
                    <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1">
                        <ul className="relative flex gap-x-1" role="tablist" aria-label="Tabs" aria-orientation="horizontal">
                            <li className="z-30 flex-auto text-center">
                                <button
                                    type="button"
                                    className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200 ${viewMode === "grid"
                                        ? "bg-slate-700 text-white"
                                        : "bg-transparent text-gray-500 hover:bg-slate-300"
                                        }`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <FaTable className={`text-lg ${viewMode === "grid" ? "text-white" : "text-gray-500"}`} />
                                </button>
                            </li>
                            <li className="z-30 flex-auto text-center">
                                <button
                                    type="button"
                                    className={`py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg focus:outline-none transition-colors duration-200 ${viewMode === "list"
                                        ? "bg-slate-700 text-white"
                                        : "bg-transparent text-gray-500 hover:bg-slate-300"
                                        }`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <FaList className={`text-lg ${viewMode === "list" ? "text-white" : "text-gray-500"}`} />
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="overflow-y-auto">
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            {filteredSalesPoints.map((point) => (
                                <div key={point.id} className="bg-white border border-gray-200 rounded-lg shadow p-6">
                                    <FaCashRegister className="w-7 h-7 text-gray-500 mb-3" />
                                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                                        {point.nombre}
                                    </h5>

                                    <button
                                        onClick={() => handleSelectSalesPoint(point.id, point.codigo, point.sucursal)}
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
                    ) : (
                        <div className="space-y-2">
                            {filteredSalesPoints.map((point) => (
                                <div key={point.id} className="flex items-center bg-white border border-gray-200 rounded-lg p-4 shadow hover:bg-gray-100">
                                    <FaCashRegister className="w-7 h-7 text-gray-500 mr-4" />
                                    <div className="flex-grow">
                                        <h5 className="text-lg font-semibold">{point.nombre}</h5>
                                    </div>
                                    <button
                                        onClick={() => handleSelectSalesPoint(point.id, point.codigo, point.sucursal)}
                                        className="ml-auto font-medium text-blue-600 hover:underline"
                                    >
                                        Ingresar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <Footer/>
            </div>

            <ModalContingency
                isOpen={isContingencyModalOpen}
                onClose={closeModal}
                onConfirm={handleConfirm}
            />
             <ModalCreatePos
                isOpen={isCreatePosModalOpen}
                onClose={closeCreatePosModal}
                onPosCreated={handleCreatePos}
                tiposPuntoVenta={tiposPuntoVenta}
            />
        </div>

    );
};

export default KanbanView;
