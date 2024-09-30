import React from 'react';

interface ReceiptOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
  onDownload: () => void;
}

const ReceiptOptionsModal: React.FC<ReceiptOptionsModalProps> = ({ isOpen, onClose, onPrint, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Opciones de Recibo</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={onPrint}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Imprimir
          </button>
          <button
            onClick={onDownload}
            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Descargar
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 text-gray-500 hover:text-gray-700 font-bold text-sm"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ReceiptOptionsModal;
