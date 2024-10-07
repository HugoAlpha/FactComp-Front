import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Product {
    id?: number;
    codigo: string;
    descripcion: string;
    unidadMedida: number;
    precioUnitario: number;
    codigoProductoSin: number;
}

interface ProductOption {
    id: number;
    codigoActividad: string;
    codigoProducto: number;
    descripcionProducto: string;
}

interface ModalCreateProductProps {
    isOpen: boolean;
    onClose: () => void;
    onProductCreated: (newProduct: any) => void;
    product?: Product;
}

const ModalCreateProduct: React.FC<ModalCreateProductProps> = ({ isOpen, onClose, onProductCreated, product }) => {
    const [codigo, setCodigo] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [unidadMedida, setUnidadMedida] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [codigoProductoSin, setCodigoProductoSin] = useState('');
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);

    const [errors, setErrors] = useState({
        codigo: '',
        nombreProducto: '',
        unidadMedida: '',
        precioUnitario: '',
        codigoProductoSin: '',
    });

    useEffect(() => {
        const fetchProductOptions = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/productos`);
                if (response.ok) {
                    const data: ProductOption[] = await response.json();
                    setProductOptions(data);
                } else {
                    Swal.fire('Error', 'Error al obtener las opciones de productos', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        };

        if (isOpen) {
            fetchProductOptions();

            if (product) {
                setCodigo(product.codigo);
                setNombreProducto(product.descripcion);
                setUnidadMedida(product.unidadMedida.toString());
                setPrecioUnitario(product.precioUnitario.toString());
                setCodigoProductoSin(product.codigoProductoSin.toString());
            } else {
                setCodigo('');
                setNombreProducto('');
                setUnidadMedida('');
                setPrecioUnitario('');
                setCodigoProductoSin('');
            }
            setErrors({
                codigo: '',
                nombreProducto: '',
                unidadMedida: '',
                precioUnitario: '',
                codigoProductoSin: '',
            });
        }
    }, [isOpen, product]);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
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
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nombreProducto':
                setNombreProducto(value);
                break;
            case 'unidadMedida':
                setUnidadMedida(value);
                break;
            case 'precioUnitario':
                setPrecioUnitario(value);
                break;
            default:
                break;
        }
        validateField(name, value);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        const selectedProduct = productOptions.find(option => option.id === selectedId);

        if (selectedProduct) {
            setSelectedOption(selectedProduct);
            setCodigo(selectedProduct.codigoActividad);
            setCodigoProductoSin(selectedProduct.codigoProducto.toString());
        }
    };

    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error !== '') || !selectedOption || !nombreProducto || !unidadMedida || !precioUnitario) {
            Swal.fire('Error', 'Por favor corrige los errores en el formulario', 'error');
            return;
        }

        const productData = {
            codigo: selectedOption.codigoActividad,
            descripcion: nombreProducto,
            unidadMedida: Number(unidadMedida),
            precioUnitario: Number(precioUnitario),
            codigoProductoSin: Number(selectedOption.codigoProducto),
        };

        try {
            let response;
            if (product && product.id) {
                response = await fetch(`${PATH_URL_BACKEND}/item/actualizar-item/${product.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
            } else {
                response = await fetch(`${PATH_URL_BACKEND}/item/crear-item`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
            }

            if (response.ok) {
                const savedProduct = await response.json();
                onProductCreated(savedProduct);
                Swal.fire('Éxito', product ? 'Producto actualizado correctamente' : 'Producto creado correctamente', 'success');
                onClose();
            } else {
                Swal.fire('Error', product ? 'Error al actualizar el producto' : 'Error al crear el producto', 'error');
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
                    {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </div>
                <form className="grid md:grid-cols-2 gap-6 mt-4" onSubmit={handleSubmitProduct}>
                    {/* Dropdown para seleccionar la descripción del producto */}
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            onChange={handleSelectChange}
                            value={selectedOption ? selectedOption.id : ''}
                            required
                        >
                            <option value="">Selecciona una descripción del producto</option>
                            {productOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.descripcionProducto}
                                </option>
                            ))}
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Homologación
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="nombreProducto"
                            value={nombreProducto}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Nombre/Descripción del Producto
                        </label>
                        {errors.nombreProducto && <span className="text-red-500 text-sm">{errors.nombreProducto}</span>}
                    </div>
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
                </form>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                        Cancelar
                    </button>
                    <button onClick={handleSubmitProduct} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                        {product ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateProduct;
