import React, { useState } from 'react';

interface ModalCreatePosProps {
    isOpen: boolean;
    onClose: () => void;
    onPosCreated: (newPos: any) => void;
    tiposPuntoVenta: { id: number; codigoClasificador: string; descripcion: string; }[];
}

const ModalCreatePos: React.FC<ModalCreatePosProps> = ({ isOpen, onClose, onPosCreated, tiposPuntoVenta }) => {
    const [nombre, setNombre] = useState('');
    const [selectedTipoPuntoVenta, setSelectedTipoPuntoVenta] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tipoSeleccionado = tiposPuntoVenta.find(t => t.codigoClasificador === selectedTipoPuntoVenta);
        
        if (!tipoSeleccionado) {
            alert('Por favor, selecciona un tipo de punto de venta.');
            return;
        }

        const newPos = {
            nombre,
            codigoTipoPuntoVenta: tipoSeleccionado.codigoClasificador,
            descripcion: tipoSeleccionado.descripcion
        };

        onPosCreated(newPos);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="text-2xl font-semibold">Agregar Punto de Venta</div>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        className="w-full p-2 mb-4 border-b-2"
                    />
                    <select
                        value={selectedTipoPuntoVenta}
                        onChange={(e) => setSelectedTipoPuntoVenta(e.target.value)}
                        required
                        className="w-full p-2 mb-4 border-b-2"
                    >
                        <option value="">Selecciona el tipo de punto de venta</option>
                        {tiposPuntoVenta.map((tipo) => (
                            <option key={tipo.id} value={tipo.codigoClasificador}>
                                {tipo.descripcion}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 mr-2">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCreatePos;
