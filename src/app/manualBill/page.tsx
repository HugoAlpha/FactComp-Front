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
    idProducto: number;
    cantidad: number;
    montoDescuento: number;
}

interface Producto {
    id: string;
    descripcion: string;
    precioUnitario: number;
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
    const [cardFields, setCardFields] = useState({ firstFour: "", lastFour: "" });
    const [giftCardAmount, setGiftCardAmount] = useState("");
    const [globalDiscount, setGlobalDiscount] = useState<string>("");
    const [discountApplied, setDiscountApplied] = useState(false);
    const [originalTotal, setOriginalTotal] = useState(0);
    const [total, setTotal] = useState(0);

    const handleCardFieldChange = (field: "firstFour" | "lastFour", value: string) => {
        setCardFields((prev) => ({ ...prev, [field]: value.replace(/[^0-9]/g, "") }));
    };

    const isCardPayment = () => {
        const selectedMethod = metodosPago.find(
            (method) => method.codigoClasificador === selectedMetodoPago
        );
        return selectedMethod?.descripcion.toLowerCase().includes('tarjeta');
    };
    
    const isGiftCardPayment = () => {
        const selectedMethod = metodosPago.find(
            (method) => method.codigoClasificador === selectedMetodoPago
        );
        return (
            selectedMethod?.descripcion.toLowerCase().includes('gift card') ||
            selectedMethod?.descripcion.toLowerCase().includes('gift-card') ||
            selectedMethod?.descripcion.toLowerCase().includes('gift')
        );
    };
    
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
            .then((data) =>
                setProductos(
                    data.map((prod: any) => ({
                        id: String(prod.id),
                        descripcion: prod.descripcion,
                        precioUnitario: prod.precioUnitario,
                    }))
                )
            );        
        }, []);

        useEffect(() => {
            calculateTotal(detalle);
        }, [detalle, discountApplied, globalDiscount]);

    const handleAddProduct = () => {
        setDetalle([...detalle, { idProducto: 0, cantidad: 1, montoDescuento: 0 }]);
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
        const updatedDetalle: DetalleProducto[] = [...detalle];
    
        if (field === "idProducto") {
            updatedDetalle[index][field] = typeof value === "string" ? parseInt(value, 10) : value;
        } else if (field === "cantidad" || field === "montoDescuento") {
            updatedDetalle[index][field] = typeof value === "string" ? parseFloat(value) : value;
        }
    
        setDetalle(updatedDetalle);
    };    

    const calculateTotal = (detalle: DetalleProducto[] = []) => {
        const subtotal = detalle.reduce((acc, item) => {
            const producto = productos.find((prod) => prod.id === String(item.idProducto));
            if (producto && producto.precioUnitario) {
                const precioTotal = producto.precioUnitario * item.cantidad - item.montoDescuento;
                return acc + (precioTotal > 0 ? precioTotal : 0);
            } else {
                console.warn(`Producto con ID ${item.idProducto} no encontrado o sin precio.`);
            }
            return acc;
        }, 0);
    
        const finalTotal = discountApplied
            ? subtotal - parseFloat(globalDiscount || "0")
            : subtotal;
        setOriginalTotal(subtotal);
        setTotal(finalTotal > 0 ? finalTotal : 0);
    };          

    const applyGlobalDiscount = () => {
        const discountValue = parseFloat(globalDiscount);
        if (isNaN(discountValue) || discountValue <= 0) {
            Swal.fire("Error", "Ingrese un descuento válido.", "error");
            return;
        }
        setDiscountApplied(true);
        calculateTotal(detalle);
    };

    const removeGlobalDiscount = () => {
        setDiscountApplied(false);
        setGlobalDiscount("");
        calculateTotal(detalle);
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
        // Validación: Asegurar que hay productos en el detalle
        if (!detalle || detalle.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pueden emitir facturas sin productos.",
            });
            return;
        }
    
        const totalFactura = calculateTotal(detalle);
    
        if (totalFactura <= 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El total de la factura debe ser mayor a 0.",
            });
            return;
        }
    
        if (isCardPayment()) {
            if (!cardFields.firstFour || !cardFields.lastFour) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Debe ingresar los primeros y últimos 4 dígitos de la tarjeta.",
                });
                return;
            }
        }
    
        // Validación de Gift Card (si aplica)
        if (isGiftCardPayment()) {
            const giftAmount = parseFloat(giftCardAmount);
            if (!giftCardAmount || giftAmount <= 0) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Debe ingresar un monto válido para la Gift Card.",
                });
                return;
            }
            if (giftAmount > totalFactura) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El monto de la Gift Card no puede ser mayor al total de los productos.",
                });
                return;
            }
        }
    
        if (!validateFechaHoraEmision(fechaHoraEmision)) return;
    
        const cliente = clientes.find((c) => c.id === parseInt(selectedCliente));
        const metodoPago = metodosPago.find((m) => m.codigoClasificador === selectedMetodoPago);
        const idPuntoVentaValue = idPuntoVenta ? parseInt(idPuntoVenta) : 0;
    
        const facturaBase = {
            usuario: cliente?.codigoCliente || "",
            idPuntoVenta: idPuntoVentaValue,
            idCliente: parseInt(selectedCliente),
            nitInvalido: true,
            codigoMetodoPago: parseInt(metodoPago?.codigoClasificador || "0"),
            activo: false,
            detalle: detalle.map((d) => ({
                idProducto: d.idProducto,
                cantidad: d.cantidad.toString(),
                montoDescuento: d.montoDescuento.toString() || "00.0",
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
            numeroTarjeta: isCardPayment()
                ? `${cardFields.firstFour}00000000${cardFields.lastFour}`
                : null,
            monGiftCard: isGiftCardPayment() ? parseFloat(giftCardAmount) : null,
            descuentoGlobal: discountApplied ? parseFloat(globalDiscount) : null,
        };
    
        Swal.fire({
            title: "Procesando...",
            html: "Por favor, espere mientras se emite la factura.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    
        if (generateMultiple && startInvoice && endInvoice) {
            const start = parseInt(startInvoice);
            const end = parseInt(endInvoice);
    
            if (start > end) {
                Swal.close();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El número inicial debe ser menor o igual al número final.",
                });
                return;
            }
    
            for (let num = start; num <= end; num++) {
                try {
                    const factura = { ...facturaBase, numeroFactura: num };
                    const response = await fetch(`${PATH_URL_BACKEND}/factura/emitir`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(factura),
                    });
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        Swal.close();
                        Swal.fire({
                            icon: "error",
                            title: `Error al emitir la factura ${num}`,
                            text: errorData.message || "Error desconocido.",
                        });
                        return;
                    }
    
                    const progress = Math.round(((num - start + 1) / (end - start + 1)) * 100);
                    Swal.update({
                        html: `Progreso: <b>${progress}%</b> (Factura ${num} de ${end})`,
                    });
                } catch (error) {
                    Swal.close();
                    console.error(`Error al emitir la factura ${num}:`, error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `No se pudo emitir la factura ${num}.`,
                    });
                    return;
                }
            }
    
            Swal.close();
            Swal.fire({
                icon: "success",
                title: "Facturas generadas",
                text: `Facturas generadas exitosamente del ${start} al ${end}.`,
            });
        } else {
            const factura = { ...facturaBase, numeroFactura: parseInt(numeroFactura) };
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/factura/emitir`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(factura),
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    Swal.close();
                    Swal.fire({
                        icon: "error",
                        title: "Error al emitir la factura",
                        text: errorData.message || "Error desconocido.",
                    });
                    return;
                }
    
                Swal.close();
                Swal.fire({
                    icon: "success",
                    title: "Factura emitida",
                    text: `Factura ${numeroFactura} emitida exitosamente.`,
                });
            } catch (error) {
                Swal.close();
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
                            {/* Selección de Método de Pago */}
                            <button
                                type="button"
                                onClick={() => setDropdownMetodoPagoOpen(!dropdownMetodoPagoOpen)}
                                className="w-full text-left p-2 border rounded"
                            >
                                {selectedMetodoPago
                                    ? metodosPago.find((m) => m.codigoClasificador === selectedMetodoPago)?.descripcion ||
                                    "Método de pago no encontrado"
                                    : "Seleccione un método de pago"}
                            </button>
                            {/* Dropdown */}
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


                    {/* Campos adicionales para Tarjeta */}
                        {isCardPayment() && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">4 Primeros Números de la Tarjeta</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={cardFields.firstFour}
                                    onChange={(e) => handleCardFieldChange("firstFour", e.target.value)}
                                    className="w-full border p-2 rounded"
                                />
                                <label className="block text-gray-700 font-medium mb-2 mt-4">4 Últimos Números de la Tarjeta</label>
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={cardFields.lastFour}
                                    onChange={(e) => handleCardFieldChange("lastFour", e.target.value)}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                        )}

                        {/* Campos adicionales para Gift Card */}
                        {isGiftCardPayment() && (
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Monto de Gift Card</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={giftCardAmount}
                                    onChange={(e) => setGiftCardAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                                />
                            </div>
                        )}


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
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Descuento Global</h3>
                            <input
                                type="number"
                                placeholder="Ingrese descuento global"
                                value={globalDiscount}
                                onChange={(e) => setGlobalDiscount(e.target.value)}
                                disabled={discountApplied}
                                className="p-2 border rounded w-full"
                            />
                            <button
                                onClick={applyGlobalDiscount}
                                className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
                                disabled={discountApplied}
                            >
                                Aplicar Descuento Global
                            </button>
                            {discountApplied && (
                                <button
                                    onClick={removeGlobalDiscount}
                                    className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
                                >
                                    Eliminar Descuento Global
                                </button>
                            )}
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Total: {total.toFixed(2)} Bs</h3>
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
