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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    Agregar Nuevo Producto
                </div>
                <form className="grid md:grid-cols-2 gap-6 mt-4" onSubmit={handleCreateProduct}>
                    {/* Código */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="codigo"
                            value={codigo}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Código
                        </label>
                        {errors.codigo && <span className="text-red-500 text-sm">{errors.codigo}</span>}
                    </div>

                    {/* Descripción */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="descripcion"
                            value={descripcion}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Descripción
                        </label>
                        {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion}</span>}
                    </div>

                    {/* Unidad de Medida */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="unidadMedida"
                            value={unidadMedida}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Unidad de Medida
                        </label>
                        {errors.unidadMedida && <span className="text-red-500 text-sm">{errors.unidadMedida}</span>}
                    </div>

                    {/* Precio Unitario */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="precioUnitario"
                            value={precioUnitario}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Precio Unitario
                        </label>
                        {errors.precioUnitario && <span className="text-red-500 text-sm">{errors.precioUnitario}</span>}
                    </div>

                    {/* Código Producto SIN */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="codigoProductoSin"
                            value={codigoProductoSin}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Código Producto SIN
                        </label>
                        {errors.codigoProductoSin && <span className="text-red-500 text-sm">{errors.codigoProductoSin}</span>}
                    </div>
                </form>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                        Cancelar
                    </button>
                    <button onClick={handleCreateProduct} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                        Crear Producto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateProduct;
