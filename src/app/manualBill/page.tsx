"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/commons/sidebar";
import Header from "@/components/commons/header";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PATH_URL_BACKEND } from "@/utils/constants";
import { FaTrash } from "react-icons/fa";
import Footer from "@/components/commons/footer";

const ManualBill = () => {
    const [clientes, setClientes] = useState([]);
    const [metodosPago, setMetodosPago] = useState([]);
    const [productos, setProductos] = useState([]);
    const [detalle, setDetalle] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState("");
    const [selectedMetodoPago, setSelectedMetodoPago] = useState("");
    const [numeroFactura, setNumeroFactura] = useState("");
    const [fechaHoraEmision, setFechaHoraEmision] = useState(new Date());
    const [dropdownClienteOpen, setDropdownClienteOpen] = useState(false);
    const [dropdownMetodoPagoOpen, setDropdownMetodoPagoOpen] = useState(false);
    const [searchCliente, setSearchCliente] = useState("");
    const [searchMetodoPago, setSearchMetodoPago] = useState("");
    const [idPuntoVenta, setIdPuntoVenta] = useState(null);
    const [idSucursal, setIdSucursal] = useState(null);
    const [rangoFechaInicio, setRangoFechaInicio] = useState(new Date());
    const [rangoFechaFin, setRangoFechaFin] = useState(new Date());

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIdPuntoVenta(localStorage.getItem("idPOS"));
            setIdSucursal(localStorage.getItem("idSucursal"));
            setRangoFechaInicio(new Date(localStorage.getItem("fechaHoraInicio") || ""));
            setRangoFechaFin(new Date(localStorage.getItem("fechaHoraFin") || ""));
        }

        fetch(`${PATH_URL_BACKEND}/api/clientes/`)
            .then(response => response.json())
            .then(data => setClientes(data));

        fetch(`${PATH_URL_BACKEND}/parametro/metodo-pago`)
            .then(response => response.json())
            .then(data => setMetodosPago(data));

        fetch(`${PATH_URL_BACKEND}/item/obtener-items`)
            .then(response => response.json())
            .then(data => setProductos(data));
    }, []);

    const handleAddProduct = () => {
        setDetalle([...detalle, { idProducto: "", cantidad: 1, montoDescuento: 0 }]);
    };

    const handleRemoveProduct = (index) => {
        const updatedDetalle = [...detalle];
        updatedDetalle.splice(index, 1);
        setDetalle(updatedDetalle);
    };

    const handleProductChange = (index, field, value) => {
        const updatedDetalle = [...detalle];
        updatedDetalle[index][field] = value;
        setDetalle(updatedDetalle);
    };

    const validateFechaHoraEmision = (date) => {
        if (date < rangoFechaInicio || date > rangoFechaFin) {
            Swal.fire({
                icon: "error",
                title: "Fecha fuera de rango",
                text: "La fecha de emisión debe estar dentro del rango permitido.",
            });
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validateFechaHoraEmision(fechaHoraEmision)) return;
    
        const cliente = clientes.find(c => c.id === parseInt(selectedCliente));
        const metodoPago = metodosPago.find(m => m.codigoClasificador === selectedMetodoPago);
    
        const factura = {
            usuario: cliente?.codigoCliente || "",
            idPuntoVenta: parseInt(idPuntoVenta),
            idCliente: parseInt(selectedCliente),
            nitInvalido: true,
            codigoMetodoPago: parseInt(metodoPago?.codigoClasificador || "0"),
            activo: false,
            detalle: detalle.map(d => ({
                idProducto: d.idProducto,
                cantidad: parseFloat(d.cantidad),
                montoDescuento: parseFloat(d.montoDescuento),
            })),
            idSucursal: parseInt(idSucursal),
            numeroFactura: parseInt(numeroFactura),
            fechaHoraEmision: `${fechaHoraEmision.getFullYear()}-${(fechaHoraEmision.getMonth() + 1).toString().padStart(2, "0")}-${fechaHoraEmision.getDate().toString().padStart(2, "0")} ${fechaHoraEmision.getHours().toString().padStart(2, "0")}:${fechaHoraEmision.getMinutes().toString().padStart(2, "0")}:${fechaHoraEmision.getSeconds().toString().padStart(2, "0")}`,
            cafc: true,
        };
    
        let timerInterval;
    
        Swal.fire({
            title: "Se está generando la factura",
            html: "Espere mientras procesamos su factura.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
        });
    
        fetch(`${PATH_URL_BACKEND}/factura/emitir`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(factura),
        })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    icon: "success",
                    title: "Factura emitida",
                    text: `Factura emitida con éxito. Número de factura: ${data.numeroFactura}`,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    didClose: () => {
                        resetForm(); 
                    },
                });
            })
            .catch(error => {
                console.error("Error al emitir factura:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo emitir la factura. Intente nuevamente.",
                });
            });
    };

    const resetForm = () => {
        setSelectedCliente("");
        setSelectedMetodoPago("");
        setNumeroFactura("");
        setFechaHoraEmision(new Date());
        setDetalle([]);
        setDropdownClienteOpen(false);
        setDropdownMetodoPagoOpen(false);
        setSearchCliente("");
        setSearchMetodoPago("");
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nombreRazonSocial.toLowerCase().includes(searchCliente.toLowerCase())
    );

    const filteredMetodosPago = metodosPago.filter(metodo =>
        metodo.descripcion.toLowerCase().includes(searchMetodoPago.toLowerCase())
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50 p-6">
                    <h2 className="text-lg md:text-xl font-bold mb-6 text-gray-700">Emitir Factura Manual</h2>

                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div className="relative">
                            <label className="block text-gray-700 font-medium mb-2">Cliente</label>
                            <button
                                type="button"
                                onClick={() => setDropdownClienteOpen(!dropdownClienteOpen)}
                                className="w-full text-left p-2 border rounded"
                            >
                                {selectedCliente
                                    ? clientes.find(c => c.id === parseInt(selectedCliente)).nombreRazonSocial
                                    : "Seleccione un cliente"}
                            </button>
                            {dropdownClienteOpen && (
                                <div className="absolute z-50 bg-white shadow-lg rounded mt-2 w-full">
                                    <input
                                        type="text"
                                        value={searchCliente}
                                        onChange={(e) => setSearchCliente(e.target.value)}
                                        placeholder="Buscar cliente"
                                        className="block w-full p-2 text-sm border-gray-300"
                                    />
                                    <ul className="max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-b">
                                        {filteredClientes.map((cliente) => (
                                            <li key={cliente.id}>
                                                <button
                                                    type="button"
                                                    className="block px-2 py-1 text-left w-full hover:bg-gray-100"
                                                    onClick={() => {
                                                        setSelectedCliente(cliente.id.toString());
                                                        setDropdownClienteOpen(false);
                                                    }}
                                                >
                                                    {cliente.nombreRazonSocial}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-gray-700 font-medium mb-2">Método de Pago</label>
                            <button
                                type="button"
                                onClick={() => setDropdownMetodoPagoOpen(!dropdownMetodoPagoOpen)}
                                className="w-full text-left p-2 border rounded"
                            >
                                {selectedMetodoPago
                                    ? metodosPago.find(m => m.codigoClasificador === selectedMetodoPago).descripcion
                                    : "Seleccione un método de pago"}
                            </button>
                            {dropdownMetodoPagoOpen && (
                                <div className="absolute z-50 bg-white shadow-lg rounded mt-2 w-full">
                                    <input
                                        type="text"
                                        value={searchMetodoPago}
                                        onChange={(e) => setSearchMetodoPago(e.target.value)}
                                        placeholder="Buscar método de pago"
                                        className="block w-full p-2 text-sm border-gray-300"
                                    />
                                    <ul className="max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-b">
                                        {filteredMetodosPago.map((metodo) => (
                                            <li key={metodo.id}>
                                                <button
                                                    type="button"
                                                    className="block px-2 py-1 text-left w-full hover:bg-gray-100"
                                                    onClick={() => {
                                                        setSelectedMetodoPago(metodo.codigoClasificador);
                                                        setDropdownMetodoPagoOpen(false);
                                                    }}
                                                >
                                                    {metodo.descripcion}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Número de Factura</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={numeroFactura}
                                onChange={(e) => setNumeroFactura(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Fecha y Hora de Emisión</label>
                            <DatePicker
                                selected={fechaHoraEmision}
                                onChange={(date) => setFechaHoraEmision(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Detalle de Productos</label>
                            {detalle.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <select
                                        className="p-2 border rounded w-full"
                                        value={item.idProducto}
                                        onChange={(e) =>
                                            handleProductChange(index, "idProducto", e.target.value)
                                        }
                                    >
                                        <option value="">Seleccione un producto</option>
                                        {productos.map(producto => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.descripcion} - Bs {producto.precioUnitario}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        className="p-2 border rounded w-20"
                                        placeholder="Cantidad"
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            handleProductChange(index, "cantidad", e.target.value)
                                        }
                                    />
                                    <input
                                        type="number"
                                        className="p-2 border rounded w-24"
                                        placeholder="Descuento"
                                        value={item.montoDescuento}
                                        onChange={(e) =>
                                            handleProductChange(index, "montoDescuento", e.target.value)
                                        }
                                    />
                                    <button
                                        onClick={() => handleRemoveProduct(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="bg-firstColor hover:bg-thirdColor text-white px-4 py-2 rounded mt-2"
                                onClick={handleAddProduct}
                            >
                                Agregar Producto
                            </button>
                        </div>

                        <button
                            className="w-full bg-green-500 text-white py-2 rounded mt-4"
                            onClick={handleSubmit}
                        >
                            Emitir Factura
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ManualBill;
