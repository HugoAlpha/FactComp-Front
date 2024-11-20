import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface ModalCreatePosProps {
    isOpen: boolean;
    onClose: () => void;
    onPosCreated: (newPos: any) => void;
    tiposPuntoVenta: { id: number; codigoClasificador: string; descripcion: string; }[];
}

const ModalCreatePos: React.FC<ModalCreatePosProps> = ({ isOpen, onClose, onPosCreated, tiposPuntoVenta }) => {
    const [nombre, setNombre] = useState('');
    const [selectedTipoPuntoVenta, setSelectedTipoPuntoVenta] = useState('');
    const [errors, setErrors] = useState({ nombre: '', selectedTipoPuntoVenta: '' });

    const validateForm = () => {
        const newErrors = { nombre: '', selectedTipoPuntoVenta: '' };
        const alphanumericPattern = /^[a-zA-Z0-9 ]*$/;

        if (!nombre) {
            newErrors.nombre = 'El nombre es requerido.';
        } else if (nombre.length > 20) {
            newErrors.nombre = 'Máximo 20 caracteres permitidos.';
        }

        if (!selectedTipoPuntoVenta) {
            newErrors.selectedTipoPuntoVenta = 'El tipo de punto de venta es requerido.';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire("Error", "Por favor corrige los errores en el formulario", "error");
            return;
        }

        const tipoSeleccionado = tiposPuntoVenta.find(t => t.codigoClasificador === selectedTipoPuntoVenta);
        const codigoSucursal = localStorage.getItem('CodigoSucursal');

        if (!tipoSeleccionado || !codigoSucursal) {
            Swal.fire("Error", "Por favor selecciona un tipo de punto de venta y asegúrate de que el código de sucursal esté definido.", "error");
            return;
        }

        const newPos = {
            nombre,
            codigoTipoPuntoVenta: parseInt(tipoSeleccionado.codigoClasificador),
            descripcion: tipoSeleccionado.descripcion,
            codigoSucursal: parseInt(codigoSucursal),
            idEmpresa: 1,
        };

        onPosCreated(newPos);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="text-2xl font-semibold text-gray-800">Agregar Punto de Venta</div>
                <form className="grid gap-6 mt-4" onSubmit={handleSubmit}>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            maxLength={20}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Nombre del Punto de Venta
                        </label>
                        {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre}</span>}
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            value={selectedTipoPuntoVenta}
                            onChange={(e) => setSelectedTipoPuntoVenta(e.target.value)}
                            className="block w-full py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
                            required
                        >
                            <option value="" disabled>Selecciona el tipo de punto de venta</option>
                            {tiposPuntoVenta.map((tipo) => (
                                <option key={tipo.id} value={tipo.codigoClasificador}>
                                    {tipo.descripcion}
                                </option>
                            ))}
                        </select>
                        {errors.selectedTipoPuntoVenta && (
                            <span className="text-red-500 text-sm">{errors.selectedTipoPuntoVenta}</span>
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-sixthColor text-white rounded-lg mr-2 "
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-principalColor text-white rounded-lg "
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
