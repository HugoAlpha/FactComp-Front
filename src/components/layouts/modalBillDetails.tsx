"use client";
import React, { useState } from 'react';


interface Bill {
    codigoSucursal: number;
    direccion?: string;
    codigoPuntoVenta: number;
    fechaEmision?: string;
    nombreRazonSocial?: string;
    codigoTipoDocumentoIdentidad: number;
    numeroDocumento?: string;
    codigoMetodoPago: number;
    numeroTarjeta?: string;
    montoTotal?: number;
    descuentoAdicional?: number;
}

interface BillDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: Bill | null;
}

interface FormattedBill {
    codigoSucursal: number;
    direccion?: string;
    codigoPuntoVenta: number;
    fechaEmision?: string;
    nombreRazonSocial?: string;
    codigoTipoDocumentoIdentidad: number;
    numeroDocumento?: string;
    codigoMetodoPago: number;
    numeroTarjeta?: string;
    montoTotal?: number;
    descuentoAdicional?: number;
}

const BillDetailsModal: React.FC<BillDetailsModalProps> = ({ isOpen, onClose, bill }) => {
    if (!isOpen || !bill) return null;

    const getSucursal = (codigoSucursal: number) => {
        switch (codigoSucursal) {
            case 0:
                return "La Paz - Miraflores";
            case 1:
                return "Santa Cruz - Segundo Anillo";
            default:
                return "Sucursal desconocida";
        }
    };

    const getPuntoVenta = (codigoPuntoVenta: number) => {
        switch (codigoPuntoVenta) {
            case 0:
                return "Caja 2";
            case 1:
                return "Caja 6";
            default:
                return "Punto de venta desconocido";
        }
    };

    const getTipoDocumento = (codigoTipoDocumentoIdentidad: number) => {
        switch (codigoTipoDocumentoIdentidad) {
            case 5:
                return "C.I.";
            case 0:
                return "NIT";
            default:
                return "Tipo de documento desconocido";
        }
    };

    const getMetodoPago = (codigoMetodoPago: number) => {
        switch (codigoMetodoPago) {
            case 1:
                return "Efectivo";
            case 2:
                return "Tarjeta";
            default:
                return "Método de pago desconocido";
        }
    };

    const formattedFechaEmision = bill.fechaEmision
        ? new Date(bill.fechaEmision).toLocaleString()
        : "Fecha desconocida";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-1/2">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Detalles de la Factura</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold">Sucursal:</label>
                            <p>{getSucursal(bill.codigoSucursal)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Dirección:</label>
                            <p>{bill.direccion || "Dirección desconocida"}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Punto de Venta:</label>
                            <p>{getPuntoVenta(bill.codigoPuntoVenta)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Fecha de Emisión:</label>
                            <p>{formattedFechaEmision}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Cliente:</label>
                            <p>{bill.nombreRazonSocial || "Cliente desconocido"}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Tipo Documento:</label>
                            <p>{getTipoDocumento(bill.codigoTipoDocumentoIdentidad)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">N° Documento:</label>
                            <p>{bill.numeroDocumento || "Documento desconocido"}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Método de Pago:</label>
                            <p>{getMetodoPago(bill.codigoMetodoPago)}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">N° Tarjeta:</label>
                            <p>{bill.numeroTarjeta || "-"}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Monto Total:</label>
                            <p>
                                {bill.montoTotal !== undefined && bill.montoTotal !== null
                                    ? `$${Number(bill.montoTotal).toFixed(2)}`
                                    : '-'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Descuento:</label>
                            <p>{bill.descuentoAdicional !== undefined && bill.descuentoAdicional !== null ? `$${bill.descuentoAdicional.toFixed(2)}` : '-'}</p>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillDetailsModal;
