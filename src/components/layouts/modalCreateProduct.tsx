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

interface UnidadMedidaOption {
    id: number;
    codigoClasificador: string;
    descripcion: string;
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
    const [unidadMedida, setUnidadMedida] = useState<string>('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [codigoProductoSin, setCodigoProductoSin] = useState('');
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<UnidadMedidaOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [errors, setErrors] = useState({
        codigo: '',
        nombreProducto: '',
        unidadMedida: '',
        precioUnitario: '',
        codigoProductoSin: '',
    });

    useEffect(() => {
        if (isOpen) {
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

            const fetchUnidadMedidaOptions = async () => {
                try {
                    const response = await fetch(`${PATH_URL_BACKEND}/parametro/unidad-medida`);
                    if (response.ok) {
                        const data: UnidadMedidaOption[] = await response.json();
                        setUnidadMedidaOptions(data);
                    } else {
                        Swal.fire('Error', 'Error al obtener las opciones de unidad de medida', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
                }
            };

            fetchProductOptions();
            fetchUnidadMedidaOptions();
        }
    }, [isOpen]); 

    useEffect(() => {
        if (product && productOptions.length > 0) {
            setCodigo(product.codigo);
            setNombreProducto(product.descripcion);
            setUnidadMedida(product.unidadMedida ? product.unidadMedida.toString() : '');
            setPrecioUnitario(product.precioUnitario ? product.precioUnitario.toString() : '');
            setCodigoProductoSin(product.codigoProductoSin ? product.codigoProductoSin.toString() : '');
            setSelectedUnidadMedida(product.unidadMedida ? product.unidadMedida.toString() : '');

            const foundOption = productOptions.find(
                (option) => option.codigoProducto === product.codigoProductoSin
            );
            if (foundOption) {
                setSelectedOption(foundOption);  
            }
        }
    }, [product, productOptions]); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'nombreProducto') {
            setNombreProducto(value);
        } else if (name === 'precioUnitario') {
            setPrecioUnitario(value);
        } else if (name === 'codigo') {
            setCodigo(value);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredProductOptions = productOptions.filter((option) =>
        option.descripcionProducto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectOption = (option: ProductOption) => {
        setSelectedOption(option);
        setCodigoProductoSin(option.codigoProducto.toString());
        setDropdownOpen(false);
    };

    const handleUnidadMedidaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCodigo = e.target.value;
        setSelectedUnidadMedida(selectedCodigo);
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(errors).some((error) => error !== '') || !selectedOption || !nombreProducto || !selectedUnidadMedida || !precioUnitario) {
            Swal.fire('Error', 'Por favor corrige los errores en el formulario', 'error');
            return;
        }

        const productData = {
            codigo,
            descripcion: nombreProducto,
            unidadMedida: selectedUnidadMedida,
            precioUnitario: Number(precioUnitario),
            codigoProductoSin: Number(selectedOption?.codigoProducto), 
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </div>
                <form className="grid md:grid-cols-2 gap-6 mt-4" onSubmit={handleSubmitProduct}>
                    {/* Campo para el código */}
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
                            Código del Producto
                        </label>
                    </div>

                    {/* Dropdown con búsqueda para seleccionar la homologación */}
                    <div className="relative z-50 w-full mb-5 group">
                        <button
                            type="button"
                            onClick={handleDropdownToggle}
                            className="block w-full text-left py-2.5 px-0 text-sm text-gray-900 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600"
                        >
                            {selectedOption ? selectedOption.descripcionProducto : 'Selecciona una descripción del producto'}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute z-50 bg-white shadow-lg rounded mt-2 w-full">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar productos"
                                    className="block w-full p-2 text-sm border-gray-300"
                                />
                                <ul className="max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-b">
                                    {filteredProductOptions.map((option) => (
                                        <li key={option.id}>
                                            <button
                                                type="button"
                                                className="block px-2 py-1 text-left w-full hover:bg-gray-100"
                                                onClick={() => handleSelectOption(option)}
                                            >
                                                {option.descripcionProducto}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>       

                    {/* Dropdown para seleccionar la unidad de medida */}
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            onChange={handleUnidadMedidaChange}
                            value={selectedUnidadMedida}
                            required
                        >
                            <option value="">Selecciona una unidad de medida</option>
                            {unidadMedidaOptions.map((option) => (
                                <option key={option.codigoClasificador} value={option.codigoClasificador}>
                                    {option.descripcion}
                                </option>
                            ))}
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Unidad de Medida
                        </label>
                    </div>

                    {/* Campo para Nombre/Descripción del Producto */}
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
                    </div>

                    {/* Campo para Precio Unitario */}
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
                            Precio Unitario en Bs.
                        </label>
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
