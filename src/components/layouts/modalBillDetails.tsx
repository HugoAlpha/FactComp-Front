import React from 'react';

interface BillDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bill: {
        documentNumber: string;
        client: string;
        date: string;
        documentType: string;
        modality: string;
        details: string;
    };
}

const BillDetailsModal: React.FC<BillDetailsModalProps> = ({ isOpen, onClose, bill }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-1/2">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Detalles de la Factura</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold">N° Documento:</label>
                            <p>{bill.documentNumber}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Cliente:</label>
                            <p>{bill.client}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Fecha:</label>
                            <p>{bill.date}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Tipo Documento:</label>
                            <p>{bill.documentType}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Modalidad:</label>
                            <p>{bill.modality}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">Detalles:</label>
                            <p>{bill.details}</p>
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
