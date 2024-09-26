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

    const [errors, setErrors] = useState({
        codigo: '',
        descripcion: '',
        unidadMedida: '',
        precioUnitario: '',
        codigoProductoSin: '',
    });

    useEffect(() => {
        if (isOpen) {
            setCodigo('');
            setDescripcion('');
            setUnidadMedida('');
            setPrecioUnitario('');
            setCodigoProductoSin('');
            setErrors({
                codigo: '',
                descripcion: '',
                unidadMedida: '',
                precioUnitario: '',
                codigoProductoSin: '',
            });
        }
    }, [isOpen]);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'codigo':
                if (!/^\d+$/.test(value)) {
                    error = 'El código solo puede contener números.';
                }
                break;
            case 'descripcion':
                if (!/^[a-zA-Z0-9\s]*$/.test(value)) {
                    error = 'La descripción solo puede contener letras, números y espacios.';
                }
                break;
            case 'unidadMedida':
                if (!/^\d+$/.test(value) || Number(value) <= 0) {
                    error = 'La unidad de medida debe ser un número positivo.';
                }
                break;
            case 'precioUnitario':
                if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
                    error = 'El precio unitario debe ser un número positivo con hasta dos decimales.';
                }
                break;
            case 'codigoProductoSin':
                if (!/^\d+$/.test(value) || Number(value) <= 0) {
                    error = 'El código Producto SIN debe ser un número positivo.';
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'codigo':
                setCodigo(value);
                break;
            case 'descripcion':
                setDescripcion(value);
                break;
            case 'unidadMedida':
                setUnidadMedida(value);
                break;
            case 'precioUnitario':
                setPrecioUnitario(value);
                break;
            case 'codigoProductoSin':
                setCodigoProductoSin(value);
                break;
            default:
                break;
        }
        validateField(name, value);
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error !== '') || !codigo || !descripcion || !unidadMedida || !precioUnitario || !codigoProductoSin) {
            Swal.fire('Error', 'Por favor corrige los errores en el formulario', 'error');
            return;
        }

        const productData = {
            codigo,
            descripcion,
            unidadMedida: Number(unidadMedida),
            precioUnitario: Number(precioUnitario),
            codigoProductoSin: Number(codigoProductoSin),
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Producto</h2>
                <form onSubmit={handleCreateProduct}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Código</label>
                        <input
                            type="text"
                            name="codigo"
                            value={codigo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors.codigo && <p className="text-red-500 text-sm">{errors.codigo}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Descripción</label>
                        <input
                            type="text"
                            name="descripcion"
                            value={descripcion}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Unidad de Medida</label>
                        <input
                            type="text"
                            name="unidadMedida"
                            value={unidadMedida}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors.unidadMedida && <p className="text-red-500 text-sm">{errors.unidadMedida}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Precio Unitario</label>
                        <input
                            type="text"
                            name="precioUnitario"
                            value={precioUnitario}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors.precioUnitario && <p className="text-red-500 text-sm">{errors.precioUnitario}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Código Producto SIN</label>
                        <input
                            type="text"
                            name="codigoProductoSin"
                            value={codigoProductoSin}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        {errors.codigoProductoSin && <p className="text-red-500 text-sm">{errors.codigoProductoSin}</p>}
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
    );
};

export default ModalCreateProduct;
