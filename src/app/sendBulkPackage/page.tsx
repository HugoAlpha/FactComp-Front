"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/commons/sidebar";
import Header from "@/components/commons/header";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { PATH_URL_BACKEND } from "@/utils/constants";
import { FaTrash } from "react-icons/fa";
import Footer from "@/components/commons/footer";

const sendBulkPackage = () => {
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
    const [idPuntoVenta, setIdPuntoVenta] = useState<string | null>(null);
    const [idSucursal, setIdSucursal] = useState<string | null>(null)
    const [rangoFechaInicio, setRangoFechaInicio] = useState(new Date());
    const [rangoFechaFin, setRangoFechaFin] = useState(new Date());
    const [cantidadFacturas, setCantidadFacturas] = useState(1);


    useEffect(() => {
        if (typeof window !== "undefined") {
            setIdPuntoVenta(localStorage.getItem("idPOS"));
            setIdSucursal(localStorage.getItem("idSucursal"));
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

    const handleMassEmission = async () => {
        const { value: idTemporal } = await Swal.fire({
            title: "Seleccione el rango de emisión",
            input: "select",
            inputOptions: {
                1: "Hoy",
                2: "Semana",
                3: "Mes",
            },
            inputPlaceholder: "Seleccione un rango",
            showCancelButton: true,
            confirmButtonText: "Enviar",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (!value) {
                    return "Debe seleccionar un rango de emisión.";
                }
            },
        });

        if (idTemporal) {
            if (!idPuntoVenta || !idSucursal) {
                Swal.fire("Error", "Faltan datos de Punto de Venta o Sucursal", "error");
                return;
            }

            Swal.fire({
                title: "Emitiendo facturas...",
                html: "Por favor, espere mientras se realiza la emisión masiva.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            try {
                const response = await fetch(
                    `${PATH_URL_BACKEND}/factura/emitir-masiva/${idPuntoVenta}/${idSucursal}/${idTemporal}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.ok) {
                    Swal.fire(
                        "¡Éxito!",
                        "La emisión masiva se completó correctamente.",
                        "success"
                    );
                } else {
                    Swal.fire(
                        "Error",
                        "Ocurrió un error al realizar la emisión masiva.",
                        "error"
                    );
                }
            } catch (error) {
                console.error("Error al emitir masivamente:", error);
                Swal.fire(
                    "Error",
                    "No se pudo conectar con el servidor. Inténtelo nuevamente.",
                    "error"
                );
            }
        }
    };

    const handleSubmit = async () => {
        if (detalle.length === 0) {
            Swal.fire("Error", "Debes agregar al menos un producto", "error");
            return;
        }

        const cliente = clientes.find(c => c.id === parseInt(selectedCliente));
        const metodoPago = metodosPago.find(m => m.codigoClasificador === selectedMetodoPago);

        const factura = {
            usuario: cliente?.codigoCliente,
            idPuntoVenta: parseInt(idPuntoVenta),
            idCliente: parseInt(selectedCliente),
            nitInvalido: true,
            codigoMetodoPago: parseInt(metodoPago?.codigoClasificador || '1'),
            activo: false,
            masivo: true,
            detalle: detalle.map(d => ({
                idProducto: d.idProducto,
                cantidad: parseFloat(d.cantidad),
                montoDescuento: parseFloat(d.montoDescuento),
            })),
            idSucursal: parseInt(idSucursal),
            numeroFactura: '',
            fechaHoraEmision: '',
            cafc: false,
            numeroTarjeta: '',
            descuentoGlobal: null,
            monGiftCard: null
        };

        let timerInterval;
        Swal.fire({
            title: "Generando facturas...",
            html: "Progreso: <b>0%</b>",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
            willClose: () => clearInterval(timerInterval),
        });

        for (let i = 0; i < cantidadFacturas; i++) {
            try {
                await fetch(`${PATH_URL_BACKEND}/factura/emitir-computarizada`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(factura),
                });

                const progress = Math.round(((i + 1) / cantidadFacturas) * 100);
                Swal.update({
                    html: `Progreso: <b>${progress}%</b><br>Facturas enviadas: <b>${i + 1} de ${cantidadFacturas}</b>`,
                });

            } catch (error) {
                console.error("Error al emitir la factura:", error);
                Swal.fire("Error", "Hubo un problema al emitir las facturas", "error");
                return;
            }
        }

        Swal.fire({
            icon: "success",
            title: "Facturas emitidas",
            text: `Se emitieron ${cantidadFacturas} facturas exitosamente.`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,

        });
        resetForm();

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
                    <h2 className="text-lg md:text-xl font-bold mb-6 text-gray-700">Envio de paquetes</h2>

                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-bold"
                            onClick={handleMassEmission}
                        >
                            Emisión masiva
                        </button>
                    </div>

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

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Cantidad de Facturas</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={cantidadFacturas}
                                onChange={(e) => setCantidadFacturas(parseInt(e.target.value))}
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
                            Registrar Facturas
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
export default sendBulkPackage;