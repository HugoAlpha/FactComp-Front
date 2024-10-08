import React, { useState } from 'react';

interface ModalCreatePosProps {
    isOpen: boolean;
    onClose: () => void;
    onPosCreated: (newPos: any) => void;
}

const ModalCreatePos: React.FC<ModalCreatePosProps> = ({ isOpen, onClose, onPosCreated }) => {
    const [descripcion, setDescripcion] = useState('');
    const [sucursal, setSucursal] = useState('');
    const [cuis, setCuis] = useState('');
    const [tipoPuntoVenta, setTipoPuntoVenta] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPosCreated({ descripcion, sucursal, cuis, tipoPuntoVenta });
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    Agregar Punto de Venta
                </div>
                <form className="grid md:grid-cols-2 gap-6 mt-4" onSubmit={handleSubmit}>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Descripción
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            name="sucursal"
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        >
                            <option value="">Selecciona una sucursal</option>
                            <option value="Sucursal A">Sucursal A</option>
                            <option value="Sucursal B">Sucursal B</option>
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Sucursal
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="cuis"
                            value={cuis}
                            onChange={(e) => setCuis(e.target.value)}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            CUIS
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            name="tipoPuntoVenta"
                            value={tipoPuntoVenta}
                            onChange={(e) => setTipoPuntoVenta(e.target.value)}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="Físico">Físico</option>
                            <option value="Virtual">Virtual</option>
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Tipo de Punto de Venta
                        </label>
                    </div>
                </form>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                        Crear Punto de Venta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCreatePos;