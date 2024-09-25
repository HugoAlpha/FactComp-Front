import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface ModalCreateProductProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: (newProduct: any) => void;
}

const ModalCreateProduct: React.FC<ModalCreateProductProps> = ({ isOpen, onClose, onProductCreated }) => {
    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [unidadMedida, setUnidadMedida] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [codigoProductoSin, setCodigoProductoSin] = useState('');

    useEffect(() => {
        if (isOpen) {
            setCodigo('');
            setDescripcion('');
            setUnidadMedida('');
            setPrecioUnitario('');
            setCodigoProductoSin('');
        }
    }, [isOpen]);

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            codigo,
            descripcion,
            unidadMedida: Number(unidadMedida),
            precioUnitario: Number(precioUnitario),
            codigoProductoSin: Number(codigoProductoSin)
        };

        try {
            const response = await fetch(`${PATH_URL_BACKEND}/item/crear-item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                const newProduct = await response.json();
                onProductCreated(newProduct);
                Swal.fire('Éxito', 'Producto creado correctamente', 'success');
                onClose();
            } else {
                Swal.fire('Error', 'Error al crear el producto', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    const validateCodigo = (value: string) => /^[0-9]*$/.test(value);
    const validateDescripcion = (value: string) => /^[a-zA-Z0-9\s]*$/.test(value);
    const validateUnidadMedida = (value: string) => /^[0-9]*$/.test(value) && Number(value) > 0;
    const validatePrecioUnitario = (value: string) => /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0;
    const validateCodigoProductoSin = (value: string) => /^[0-9]*$/.test(value) && Number(value) > 0;

    return (
        isOpen ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Producto</h2>
                    <form onSubmit={handleCreateProduct}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Código</label>
                            <input
                                type="text"
                                value={codigo}
                                onChange={(e) => {
                                    if (validateCodigo(e.target.value)) setCodigo(e.target.value);
                                }}
                                className="w-full p-2 border rounded-lg"
                                required
                                placeholder="Solo números"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Descripción</label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => {
                                    if (validateDescripcion(e.target.value)) setDescripcion(e.target.value);
                                }}
                                className="w-full p-2 border rounded-lg"
                                required
                                placeholder="Letras, números y espacios"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Unidad de Medida</label>
                            <input
                                type="text"
                                value={unidadMedida}
                                onChange={(e) => {
                                    if (validateUnidadMedida(e.target.value)) setUnidadMedida(e.target.value);
                                }}
                                className="w-full p-2 border rounded-lg"
                                required
                                placeholder="Solo números positivos"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Precio Unitario</label>
                            <input
                                type="text"
                                value={precioUnitario}
                                onChange={(e) => {
                                    if (validatePrecioUnitario(e.target.value)) setPrecioUnitario(e.target.value);
                                }}
                                className="w-full p-2 border rounded-lg"
                                required
                                placeholder="Solo números positivos"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Código Producto SIN</label>
                            <input
                                type="text"
                                value={codigoProductoSin}
                                onChange={(e) => {
                                    if (validateCodigoProductoSin(e.target.value)) setCodigoProductoSin(e.target.value);
                                }}
                                className="w-full p-2 border rounded-lg"
                                required
                                placeholder="Solo números positivos"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                            >
                                Crear Producto
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        ) : null
    );
};

export default ModalCreateProduct;
