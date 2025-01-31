import { PATH_URL_BACKEND, PATH_URL_IMAGES } from '@/utils/constants';
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
    refreshProducts: () => void;
    product?: Product;
}

const ModalCreateProduct: React.FC<ModalCreateProductProps> = ({ isOpen, onClose, onProductCreated, product, refreshProducts }) => {
    const [codigo, setCodigo] = useState('');
    const [nombreProducto, setNombreProducto] = useState('');
    const [unidadMedida, setUnidadMedida] = useState<string>('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [codigoProductoSin, setCodigoProductoSin] = useState('');
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<UnidadMedidaOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedUnidadMedida, setSelectedUnidadMedida] = useState<UnidadMedidaOption | null>(null);
    const [searchTermUnidadMedida, setSearchTermUnidadMedida] = useState('');
    const [dropdownOpenUnidadMedida, setDropdownOpenUnidadMedida] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previousImageId, setPreviousImageId] = useState<number | null>(null);
    const maxLength = 100;

    const handleDescriptionChange = (e) => {
        setNombreProducto(e.target.value);
    };
    
    const [errors, setErrors] = useState({
        codigo: '',
        nombreProducto: '',
        unidadMedida: '',
        precioUnitario: '',
        codigoProductoSin: '',
        image:''
    });

    useEffect(() => {
        if (isOpen) {
            fetchProductOptions();
            fetchUnidadMedidaOptions();
            if (product) {
                setCodigo(product.codigo);
                setNombreProducto(product.descripcion);
                setUnidadMedida(product.unidadMedida ? product.unidadMedida.toString() : '');
                setPrecioUnitario(product.precioUnitario ? product.precioUnitario.toString() : '');
                setCodigoProductoSin(product.codigoProductoSin ? product.codigoProductoSin.toString() : '');
                setPreviousImageId(product.imageId || null);
            }
        } else {
            setCodigo('');
            setNombreProducto('');
            setUnidadMedida('');
            setPrecioUnitario('');
            setCodigoProductoSin('');
            setPreviousImageId(null);
        }
    }, [isOpen, product]);

    const fetchProductOptions = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/productos`);
            if (response.ok) {
                const data: ProductOption[] = await response.json();
                setProductOptions(data);
            } else {
                Swal.fire('Error', 'Error al obtener las opciones de productos', 'error');
            }
        } catch {
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
        } catch {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };



    useEffect(() => {
        if (isOpen) {
            if (product) {
                setCodigo(product.codigo);
                setNombreProducto(product.descripcion);
                setUnidadMedida(product.unidadMedida ? product.unidadMedida.toString() : '');
                setPrecioUnitario(product.precioUnitario ? product.precioUnitario.toString() : '');
                setCodigoProductoSin(product.codigoProductoSin ? product.codigoProductoSin.toString() : '');
                const foundOption = productOptions.find(
                    (option) => option.codigoProducto === product.codigoProductoSin
                );
                setSelectedOption(foundOption || null);
                const unidadEncontrada = unidadMedidaOptions.find(
                    (u) => u.codigoClasificador === product.unidadMedida.toString()
                );
                setSelectedUnidadMedida(unidadEncontrada || null);
            } else {
                setCodigo('');
                setNombreProducto('');
                setUnidadMedida('');
                setPrecioUnitario('');
                setCodigoProductoSin('');
                setSelectedOption(null);
                setSelectedImage(null);
                setSelectedUnidadMedida(null);
            }
        }
    }, [isOpen, product, productOptions]);

    const uploadImage = async (itemId: number) => {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("idItem", itemId.toString());

        try {
            const response = previousImageId
                ? await fetch(`${PATH_URL_IMAGES}/images/upload/${previousImageId}/update`, {
                    method: "PUT",
                    body: formData,
                })
                : await fetch(`${PATH_URL_IMAGES}/images/upload`, {
                    method: "POST",
                    body: formData,
                });

            if (response.ok) {
                Swal.fire("Éxito", "Imagen actualizada correctamente", "success");
            } else {
                Swal.fire("Error", "Error al actualizar la imagen", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo conectar con el servidor para actualizar la imagen", "error");
        }
    };

    const validateForm = () => {
        const newErrors = { codigo: '', nombreProducto: '', unidadMedida: '', precioUnitario: '', codigoProductoSin: '', image: '' };
        const alphanumericPattern = /^[a-zA-Z0-9]+$/;
        const numericPattern = /^[0-9]+(\.[0-9]+)?$/;

        if (!codigo) {
            newErrors.codigo = 'Este campo es requerido.';
        } else if (codigo.length > 10) {
            newErrors.codigo = 'Máximo 10 caracteres permitidos.';
        }

        if (!nombreProducto) {
            newErrors.nombreProducto = 'Este campo es requerido.';
        } else if (nombreProducto.length > 100) {
            newErrors.nombreProducto = 'Máximo 100 caracteres permitidos.';
        }

        if (!precioUnitario) {
            newErrors.precioUnitario = 'Este campo es requerido.';
        } else if (!numericPattern.test(precioUnitario)) {
            newErrors.precioUnitario = 'Debe ser un número válido.';
        } else if (precioUnitario.length > 10) {
            newErrors.precioUnitario = 'Máximo 10 caracteres permitidos.';
        }

        if (!selectedOption) {
            newErrors.codigoProductoSin = 'La homologación es requerida.';
        }

        if (!selectedUnidadMedida) {
            newErrors.unidadMedida = 'La unidad de medida es requerida.';
        }
        if (selectedImage) {
            const fileType = selectedImage.type;
            if (fileType !== "image/jpeg" && fileType !== "image/png") {
                newErrors.image = 'Solo se permiten archivos JPG o PNG.';
            }
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchChangeUnidadMedida = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTermUnidadMedida(e.target.value);
    };

    const filteredUnidadMedidaOptions = unidadMedidaOptions.filter(option =>
        option.descripcion.toLowerCase().includes(searchTermUnidadMedida.toLowerCase())
    );

    const handleDropdownToggleUnidadMedida = () => {
        setDropdownOpenUnidadMedida((prev) => !prev);
    };

    const handleSelectUnidadMedida = (option: UnidadMedidaOption) => {
        setSelectedUnidadMedida(option);
        setDropdownOpenUnidadMedida(false);
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
        if (!validateForm()) {
            Swal.fire("Error", "Por favor, complete los campos obligatorios correctamente.", "error");
            return;
        }

        const productData = {
            id: product?.id,
            codigo,
            descripcion: nombreProducto,
            unidadMedida: selectedUnidadMedida?.codigoClasificador,
            precioUnitario: Number(precioUnitario),
            codigoProductoSin: Number(selectedOption?.codigoProducto),
        };

        try {
            let response;
            if (product && product.id) {
                response = await fetch(`${PATH_URL_BACKEND}/item/actualizar-item/${product.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productData),
                });
            } else {
                response = await fetch(`${PATH_URL_BACKEND}/item/crear-item`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productData),
                });
            }

            if (response.ok) {
                const savedProduct = await response.json();
                onProductCreated(savedProduct);

                Swal.fire({
                    icon: "success",
                    title: product ? "Producto actualizado correctamente" : "Producto creado correctamente",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(async () => {
                    if (selectedImage) {
                        await uploadImage(savedProduct.id);
                    }
                    refreshProducts();
                    onClose();
                });
            } else {
                Swal.fire("Error", product ? "Error al actualizar el producto" : "Error al crear el producto", "error");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo conectar con el servidor", "error");
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
    
                    {/* Código Interno del Producto */}
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="text-sm text-gray-500">Código Interno del Producto</label>
                        <input
                            type="text"
                            name="codigo"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
                            placeholder="Código identificadors único"
                            style={{ whiteSpace: 'normal' }}
                            required
                        />
                        {errors.codigo && <span className="text-red-500 text-sm">{errors.codigo}</span>}
                    </div>
    
                    {/* Homologación SIAT */}
                    <div className="relative z-50 w-full mb-5 group">
                        <label className="text-sm text-gray-500">Homologación SIAT</label>
                        <button
                            type="button"
                            onClick={handleDropdownToggle}
                            className="block w-full text-left py-2.5 px-0 text-sm text-gray-900 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600"
                        >
                            {selectedOption ? selectedOption.descripcionProducto : 'Selecciona una homologación para el producto'}
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
                        {errors.codigoProductoSin && <span className="text-red-500 text-sm">{errors.codigoProductoSin}</span>}
                    </div>
    
                    {/* Unidad de medida SIAT */}
                    <div className="relative z-50 w-full mb-5 group">
                        <label className="text-sm text-gray-500">Unidad de medida SIAT</label>
                        <button
                            type="button"
                            onClick={handleDropdownToggleUnidadMedida}
                            className="block w-full text-left py-2.5 px-0 text-sm text-gray-900 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600"
                        >
                            {selectedUnidadMedida ? selectedUnidadMedida.descripcion : 'Selecciona una unidad de medida'}
                        </button>
                        {dropdownOpenUnidadMedida && (
                            <div className="absolute z-50 bg-white shadow-lg rounded mt-2 w-full">
                                <input
                                    type="text"
                                    value={searchTermUnidadMedida}
                                    onChange={handleSearchChangeUnidadMedida}
                                    placeholder="Buscar unidad de medida"
                                    className="block w-full p-2 text-sm border-gray-300"
                                />
                                <ul className="max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-b">
                                    {filteredUnidadMedidaOptions.map((option) => (
                                        <li key={option.codigoClasificador}>
                                            <button
                                                type="button"
                                                className="block px-2 py-1 text-left w-full hover:bg-gray-100"
                                                onClick={() => handleSelectUnidadMedida(option)}
                                            >
                                                {option.descripcion}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {errors.unidadMedida && <span className="text-red-500 text-sm">{errors.unidadMedida}</span>}
                    </div>
    
                    {/* Descripción Comercial del Producto */}
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="text-sm text-gray-500">Descripción Comercial del Producto</label>
                        <input
                            type="text"
                            name="nombreProducto"
                            value={nombreProducto}
                            onChange={handleDescriptionChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
                            placeholder="Descripción para el cliente"
                            style={{ whiteSpace: 'normal' }}
                            maxLength={maxLength + 1} 
                            required
                        />
                        {/* Contador de caracteres */}
                        <span
                            className={`text-sm mt-1 ${
                                nombreProducto.length > maxLength ? 'text-red-500' : 'text-gray-500'
                            }`}
                        >
                            Caracteres: {nombreProducto.length} de {maxLength}
                        </span>
                    </div>
    
                    {/* Precio Unitario en Bs. */}
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="text-sm text-gray-500">Precio Unitario en Bs.</label>
                        <input
                            type="text"
                            name="precioUnitario"
                            value={precioUnitario}
                            onChange={(e) => setPrecioUnitario(e.target.value)}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600"
                            placeholder="Precio por unidad del producto"
                            style={{ whiteSpace: 'normal' }}
                            required
                        />
                        {errors.precioUnitario && <span className="text-red-500 text-sm">{errors.precioUnitario}</span>}
                    </div>
    
                </form>
    
                {/* Selector de imagen */}
                <div className="relative z-0 w-full my-5 group">
                    <label className="text-sm text-gray-500">Selecciona una imagen (JPG o PNG)</label>
                    <input
                        type="file"
                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
                </div>
    
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                        Cancelar
                    </button>
                    <button onClick={handleSubmitProduct} className="px-6 py-2 bg-principalColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                        {product ? 'Actualizar Producto' : 'Crear Producto'}
                    </button>
                </div>
            </div>
        </div>
    );    
};

export default ModalCreateProduct;