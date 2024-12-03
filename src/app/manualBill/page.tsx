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

interface Cliente {
    id: number; 
    codigoCliente: string;
    nombreRazonSocial: string;
}

interface MetodoPago {
    id: number;  
    codigoClasificador: string;
    descripcion: string;
}

interface DetalleProducto {
    idProducto: string;
    cantidad: number;
    montoDescuento: number;
}

interface Producto {
    id: string;
    descripcion: string;
}


const ManualBill = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [selectedCliente, setSelectedCliente] = useState("");
    const [selectedMetodoPago, setSelectedMetodoPago] = useState("");
    const [numeroFactura, setNumeroFactura] = useState("");
    const [fechaHoraEmision, setFechaHoraEmision] = useState(new Date());
    const [dropdownClienteOpen, setDropdownClienteOpen] = useState(false);
    const [dropdownMetodoPagoOpen, setDropdownMetodoPagoOpen] = useState(false);
    const [searchCliente, setSearchCliente] = useState("");
    const [searchMetodoPago, setSearchMetodoPago] = useState("");
    const [idPuntoVenta, setIdPuntoVenta] = useState<string | null>(null);
    const [idSucursal, setIdSucursal] = useState<string | null>(null);

    const [rangoFechaInicio, setRangoFechaInicio] = useState(new Date());
    const [rangoFechaFin, setRangoFechaFin] = useState(new Date());
    const [generateMultiple, setGenerateMultiple] = useState(false);
    const [startInvoice, setStartInvoice] = useState("");
    const [endInvoice, setEndInvoice] = useState("");

    const [detalle, setDetalle] = useState<DetalleProducto[]>([]);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const idPuntoVentaValue = localStorage.getItem("idPOS");
            setIdPuntoVenta(idPuntoVentaValue === null ? null : idPuntoVentaValue);

            const idSucursalValue = localStorage.getItem("idSucursal");
            setIdSucursal(idSucursalValue === null ? null : idSucursalValue);
            setRangoFechaInicio(new Date(localStorage.getItem("fechaHoraInicio") || ""));
            setRangoFechaFin(new Date(localStorage.getItem("fechaHoraFin") || ""));
        }

        fetch(`${PATH_URL_BACKEND}/api/clientes/`)
            .then((response) => response.json())
            .then((data) => setClientes(data));

        fetch(`${PATH_URL_BACKEND}/parametro/metodo-pago`)
            .then((response) => response.json())
            .then((data) => setMetodosPago(data));

        fetch(`${PATH_URL_BACKEND}/item/obtener-items`)
            .then((response) => response.json())
            .then((data) => setProductos(data));
    }, []);

    const handleAddProduct = () => {
        setDetalle([...detalle, { idProducto: "", cantidad: 1, montoDescuento: 0 }]);
    };
    

    const handleRemoveProduct = (index: number) => {
        const updatedDetalle = [...detalle];
        updatedDetalle.splice(index, 1);
        setDetalle(updatedDetalle);
    };
    
    const handleProductChange = (
        index: number,
        field: keyof DetalleProducto,
        value: string | number
    ) => {
        const updatedDetalle = [...detalle];
        
        // Ensure the value type is correct for the field
        if (typeof value === 'string' && (field === 'cantidad' || field === 'montoDescuento')) {
            value = parseFloat(value); // Convert string to number if needed
        }
    
        updatedDetalle[index][field] = value;
        setDetalle(updatedDetalle);
    };
    
    const validateFechaHoraEmision = (date: Date) => {
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

    const handleSubmit = async () => {
        if (!validateFechaHoraEmision(fechaHoraEmision)) return;
    
        const cliente = clientes.find((c) => c.id === parseInt(selectedCliente));
        const metodoPago = metodosPago.find((m) => m.codigoClasificador === selectedMetodoPago);
    
        const facturaBase = {
            usuario: cliente?.codigoCliente || "",
            idPuntoVenta: parseInt(idPuntoVenta),
            idCliente: parseInt(selectedCliente),
            nitInvalido: true,
            codigoMetodoPago: parseInt(metodoPago?.codigoClasificador || "0"),
            activo: false,
            detalle: detalle.map((d) => ({
                idProducto: d.idProducto,
                cantidad: d.cantidad.toString(), 
                montoDescuento: d.montoDescuento.toString(), 
            })),
            idSucursal: parseInt(idSucursal || "0"), 
            fechaHoraEmision: `${fechaHoraEmision.getFullYear()}-${(fechaHoraEmision.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${fechaHoraEmision
                .getDate()
                .toString()
                .padStart(2, "0")} ${fechaHoraEmision
                .getHours()
                .toString()
                .padStart(2, "0")}:${fechaHoraEmision
                .getMinutes()
                .toString()
                .padStart(2, "0")}:${fechaHoraEmision.getSeconds().toString().padStart(2, "0")}`,
            cafc: true,
        };
    
        // Handle multiple invoices if generateMultiple is true
        if (generateMultiple && startInvoice && endInvoice) {
            const start = parseInt(startInvoice);
            const end = parseInt(endInvoice);
    
            if (start > end) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El número inicial debe ser menor o igual al número final.",
                });
                return;
            }
    
            Swal.fire({
                title: "Generando facturas...",
                html: "Progreso: <b>0%</b>",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
    
            for (let num = start; num <= end; num++) {
                try {
                    const factura = { ...facturaBase, numeroFactura: num };
                    await fetch(`${PATH_URL_BACKEND}/factura/emitir`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(factura),
                    });
    
                    const progress = Math.round(((num - start + 1) / (end - start + 1)) * 100);
                    Swal.update({
                        html: `Progreso: <b>${progress}%</b> (Factura ${num} de ${end})`,
                    });
                } catch (error) {
                    console.error(`Error al emitir la factura ${num}:`, error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `No se pudo emitir la factura ${num}.`,
                    });
                    return;
                }
            }
    
            Swal.fire({
                icon: "success",
                title: "Facturas generadas",
                text: `Facturas generadas exitosamente del ${start} al ${end}.`,
            });
        } else {
            const factura = { ...facturaBase, numeroFactura: parseInt(numeroFactura) };
            try {
                await fetch(`${PATH_URL_BACKEND}/factura/emitir`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(factura),
                });
    
                Swal.fire({
                    icon: "success",
                    title: "Factura emitida",
                    text: `Factura ${numeroFactura} emitida exitosamente.`,
                });
            } catch (error) {
                console.error("Error al emitir la factura:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo emitir la factura. Intente nuevamente.",
                });
            }
        }
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
                    <h2 className="text-lg md:text-xl font-bold mb-6 text-gray-700">
                        Emitir Factura Manual
                    </h2>

                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div className="relative">
                            <label className="block text-gray-700 font-medium mb-2">Cliente</label>
                            <button
                                type="button"
                                onClick={() => setDropdownClienteOpen(!dropdownClienteOpen)}
                                className="w-full text-left p-2 border rounded"
                            >
                                {selectedCliente
                                    ? (() => {
                                        const cliente = clientes.find(c => c.id === parseInt(selectedCliente));
                                        return cliente ? cliente.nombreRazonSocial : "Cliente no encontrado";
                                    })()
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
                                    ? metodosPago.find(m => m.codigoClasificador === selectedMetodoPago)?.descripcion || "Método de pago no encontrado"
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
                            {!generateMultiple ? (
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={numeroFactura}
                                    onChange={(e) => setNumeroFactura(e.target.value)}
                                />
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Desde"
                                        className="w-full border p-2 rounded"
                                        value={startInvoice}
                                        onChange={(e) => setStartInvoice(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Hasta"
                                        className="w-full border p-2 rounded"
                                        value={endInvoice}
                                        onChange={(e) => setEndInvoice(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Fecha y Hora de Emisión</label>
                            <DatePicker
                                selected={fechaHoraEmision || new Date()} 
                                onChange={(date: Date | null) => setFechaHoraEmision(date || new Date())} 
                                showTimeSelect
                                timeFormat="HH:mm"
                                dateFormat="yyyy-MM-dd HH:mm"
                                className="w-full border p-2 rounded"
                            />

                        </div>

                        <div className="flex row">
                            <label className="block text-gray-700 font-medium mb-2">
                                Generar más de una factura
                            </label>
                            <input
                                type="checkbox"
                                checked={generateMultiple}
                                onChange={(e) => setGenerateMultiple(e.target.checked)}
                                className="ml-2"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Detalle de Productos</label>
                            {detalle.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <select
                                        value={item.idProducto}
                                        onChange={(e) =>
                                            handleProductChange(index, "idProducto", e.target.value)
                                        }
                                        className="p-2 border rounded w-full"
                                    >
                                        <option value="">Seleccione un producto</option>
                                        {productos.map((producto) => (
                                            <option key={producto.id} value={producto.id}>
                                                {producto.descripcion}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        value={item.cantidad}
                                        onChange={(e) =>
                                            handleProductChange(index, "cantidad", e.target.value)
                                        }
                                        className="p-2 border rounded w-20"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Descuento"
                                        value={item.montoDescuento}
                                        onChange={(e) =>
                                            handleProductChange(index, "montoDescuento", e.target.value)
                                        }
                                        className="p-2 border rounded w-24"
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
                                onClick={handleAddProduct}
                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Agregar Producto
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-green-500 text-white py-2 rounded mt-4"
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
