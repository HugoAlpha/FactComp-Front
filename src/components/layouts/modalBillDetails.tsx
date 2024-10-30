"use client";
import React from 'react';
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
        return `Punto de venta ${codigoPuntoVenta}`;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-500">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    Detalles de la Factura
                </div>
                <div className="p-6 m-6">
                    <div className="grid gap-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Sucursal:</span>
                            <span>{getSucursal(bill.codigoSucursal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Dirección:</span>
                            <span>{bill.direccion || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Punto de Venta:</span>
                            <span>{getPuntoVenta(bill.codigoPuntoVenta)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Fecha de Emisión:</span>
                            <span>{bill.fechaEmision ? new Date(bill.fechaEmision).toLocaleString() : 'N/A'}</span>  
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Razón Social:</span>
                            <span>{bill.nombreRazonSocial || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Tipo de Documento:</span>
                            <span>{bill.codigoTipoDocumentoIdentidad === 0 ? 'NIT' : 'CI'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Número Documento:</span>
                            <span>{bill.numeroDocumento || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Método de Pago:</span>
                            <span>{bill.codigoMetodoPago}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Número de Tarjeta:</span>
                            <span>{bill.numeroTarjeta || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Monto Total:</span>
                            <span>{bill.montoTotal ? `$${bill.montoTotal.toFixed(2)}` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Descuento Adicional:</span>
                            <span>{bill.descuentoAdicional ? `$${bill.descuentoAdicional.toFixed(2)}` : 'N/A'}</span>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillDetailsModal;
