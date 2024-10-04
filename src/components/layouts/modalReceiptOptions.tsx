import React from 'react';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface ReceiptOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuf: string;
  numeroFactura: number;
}

const ReceiptOptionsModal: React.FC<ReceiptOptionsModalProps> = ({ isOpen, onClose, cuf, numeroFactura }) => {
  if (!isOpen) return null;

  const handlePrintReceipt = async () => {
    try {
      const response = await fetch(`${PATH_URL_BACKEND}/pdf/download?cufd=${cuf}&numeroFactura=${numeroFactura}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const printWindow = window.open(url);
        printWindow?.focus();
        printWindow?.print();
      } else {
        Swal.fire('Error', 'No se pudo descargar la factura para imprimir.', 'error');
      }
    } catch (error) {
      console.error('Error al descargar la factura para imprimir:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar descargar la factura.', 'error');
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(`${PATH_URL_BACKEND}/pdf/download?cufd=${cuf}&numeroFactura=${numeroFactura}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Factura_${numeroFactura}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        Swal.fire('Error', 'No se pudo descargar la factura.', 'error');
      }
    } catch (error) {
      console.error('Error al descargar la factura:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar descargar la factura.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Opciones de Recibo</h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handlePrintReceipt}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Imprimir
          </button>
          <button
            onClick={handleDownloadReceipt}
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
