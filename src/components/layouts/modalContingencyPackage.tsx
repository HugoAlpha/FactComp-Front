import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface ContingencyPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContingencyPackage: React.FC<ContingencyPackageModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async () => {
    if (!selectedFile) {
      Swal.fire('Error', 'Por favor, selecciona un archivo.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${PATH_URL_BACKEND}/contingency/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Swal.fire('Éxito', 'Paquete de contingencia enviado correctamente.', 'success');
        onClose();
      } else {
        Swal.fire('Error', 'No se pudo enviar el paquete de contingencia.', 'error');
      }
    } catch (error) {
      console.error('Error al enviar el paquete de contingencia:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar enviar el paquete.', 'error');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Enviar Paquete de Contingencia</h2>
        <div
          className="border-dashed border-2 border-gray-300 rounded-lg p-6 flex justify-center items-center cursor-pointer mb-4"
          onDrop={(e) => {
            e.preventDefault();
            setSelectedFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {selectedFile ? (
            <p className="text-green-500">Archivo seleccionado: {selectedFile.name}</p>
          ) : (
            <p className="text-gray-500">Arrastra o selecciona un archivo</p>
          )}
        </div>
        <input type="file" onChange={handleFileSelect} className="w-full mb-4" />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleFileUpload}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalContingencyPackage;
