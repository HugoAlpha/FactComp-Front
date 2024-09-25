import React from 'react';

interface ModalCreatePosProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCreatePos: React.FC<ModalCreatePosProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Agregar Punto de Venta</h2>

                {/* Formulario de creación del punto de venta */}
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
                        <input
                            type="text"
                            className="border rounded w-full py-2 px-3 text-gray-700"
                            placeholder="Ingresa la descripción del punto de venta"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Sucursal:</label>
                        <select className="border rounded w-full py-2 px-3 text-gray-700">
                            <option value="Sucursal A">Sucursal A</option>
                            <option value="Sucursal B">Sucursal B</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">CUIS:</label>
                        <input
                            type="text"
                            className="border rounded w-full py-2 px-3 text-gray-700"
                            placeholder="Ingresa el CUIS"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Punto de Venta:</label>
                        <select className="border rounded w-full py-2 px-3 text-gray-700">
                            <option value="Físico">Físico</option>
                            <option value="Virtual">Virtual</option>
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded-lg mr-2"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white py-2 px-4 rounded-lg"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCreatePos;
