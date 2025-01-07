import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface Customer {
    id: number;
    nombreRazonSocial: string;
    numeroDocumento: string;
    complemento: string;
    codigoTipoDocumentoIdentidad: number;
    codigoCliente: string;
    email: string;
    nitInvalido?: number;
}

interface DocumentType {
    id: number;
    codigoClasificador: string;
    descripcion: string;
    codigoTipoParametro: string;
}

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer;
    onSave: (customer: Customer) => void;
}

const CreateEditClientModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, customer, onSave }) => {
    const [formData, setFormData] = useState<Customer>({ ...customer, codigoTipoDocumentoIdentidad: 0 });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>(customer.codigoTipoDocumentoIdentidad.toString());

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/parametro/identidad`);
                if (response.ok) {
                    const data: DocumentType[] = await response.json();
                    setDocumentTypes(data);
                } else {
                    Swal.fire('Error', 'Error al obtener tipos de documentos de identidad', 'error');
                }
            } catch {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        };

        fetchDocumentTypes();
    }, []);

    useEffect(() => {
        setFormData(customer);
        setErrors({});
        setSelectedDocumentType(customer.codigoTipoDocumentoIdentidad ? customer.codigoTipoDocumentoIdentidad.toString() : '');
    }, [customer, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
    
        if (name === 'numeroDocumento' && ['1', '5'].includes(selectedDocumentType)) {
            const numericOnly = value.replace(/[^0-9]/g, ''); 
            setFormData((prevData) => ({ ...prevData, [name]: numericOnly }));
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
            return;
        }
    
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };
    

    const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setSelectedDocumentType(selectedType);
        setErrors((prevErrors) => ({ ...prevErrors, codigoTipoDocumentoIdentidad: '' }));
    
        const selectedTypeObject = documentTypes.find((docType) => docType.codigoClasificador === selectedType);
    
        if (selectedTypeObject) {
            setFormData((prevData) => ({
                ...prevData,
                codigoTipoDocumentoIdentidad: parseInt(selectedTypeObject.codigoClasificador),
                complemento: ['3', '5'].includes(selectedType) ? '' : prevData.complemento, // Limpia para 3 y 5
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                codigoTipoDocumentoIdentidad: 0,
            }));
        }
    };    

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!formData.nombreRazonSocial) {
            newErrors.nombreRazonSocial = 'Este campo es requerido.';
        } else if (formData.nombreRazonSocial.length > 30) {
            newErrors.nombreRazonSocial = 'Número de caracteres permitido: 30.';
        }
    
        if (!formData.email) {
            newErrors.email = 'Este campo es requerido.';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = 'El formato del correo electrónico es inválido.';
        } else if (formData.email.length > 50) {
            newErrors.email = 'Número de caracteres permitido: 50.';
        }
    
        if (!formData.numeroDocumento) {
            newErrors.numeroDocumento = 'Este campo es requerido.';
        } else if (formData.numeroDocumento.length > 20) {
            newErrors.numeroDocumento = 'Número de caracteres permitido: 20.';
        } else if (['1', '5'].includes(selectedDocumentType)) {
            if (!/^\d+$/.test(formData.numeroDocumento)) {
                newErrors.numeroDocumento = 'Solo se permiten números para este tipo de documento.';
            }
        }
    
        if (!formData.codigoTipoDocumentoIdentidad || formData.codigoTipoDocumentoIdentidad === 0) {
            newErrors.codigoTipoDocumentoIdentidad = 'Debe seleccionar un tipo de documento.';
        }
    
        if (formData.complemento) {
            if (formData.complemento.length > 15) {
                newErrors.complemento = 'Número de caracteres permitido: 15.';
            }
        }
    
        if (!formData.codigoCliente) {
            newErrors.codigoCliente = 'Este campo es requerido.';
        } else if (formData.codigoCliente.length > 20) {
            newErrors.codigoCliente = 'Número de caracteres permitido: 20.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    


    const validateNIT = async () => {
        if (formData.codigoTipoDocumentoIdentidad === 5) {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/codigos/verificar-nit?nit=${formData.numeroDocumento}`);
                const result = await response.json();

                if (result.transaccion && result.mensajesList[0].codigo === 986) {
                    setFormData((prevData) => ({ ...prevData, nitInvalido: 1 }));
                    return true;
                } else {
                    const userConfirmation = await Swal.fire({
                        title: 'NIT inválido',
                        text: `El NIT ingresado no es válido. ¿Deseas proceder con la creación del cliente de todas formas? Código: ${result.mensajesList[0].codigo}`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, continuar',
                        cancelButtonText: 'No, cancelar'
                    });

                    setFormData((prevData) => ({
                        ...prevData,
                        nitInvalido: userConfirmation.isConfirmed ? 0 : 1,
                    }));

                    return userConfirmation.isConfirmed;
                }
            } catch {
                Swal.fire('Error', 'No se pudo conectar para verificar el NIT', 'error');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            if (['1', '5'].includes(selectedDocumentType)) {
                setFormData((prevData) => ({
                    ...prevData,
                    numeroDocumento: prevData.numeroDocumento.replace(/[^0-9]/g, ''),
                }));
            }
    
            const isNITValid = await validateNIT();
            if (!isNITValid) return;
    
            try {
                const body = {
                    ...formData,
                    nitInvalido: formData.nitInvalido !== undefined ? formData.nitInvalido : 1,
                };
    
                let response;
                if (customer.id) {
                    response = await fetch(`${PATH_URL_BACKEND}/api/clientes/${customer.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    });
                } else {
                    response = await fetch(`${PATH_URL_BACKEND}/api/clientes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    });
                }
    
                if (response.ok) {
                    const savedCustomer = await response.json();
                    onSave(savedCustomer);
                    onClose();
                    Swal.fire({
                        icon: 'success',
                        title: customer.id ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente',
                        text: '',
                    });
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar el cliente', 'error');
                }
            } catch {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        } else {
            Swal.fire('Error', 'Por favor, complete los campos obligatorios correctamente.', 'error');
        }
    };    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg w-500">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {customer.id ? 'Edición de Cliente' : 'Agregar nuevo Cliente'}
                </div>
                <div className="p-6 m-6">
                    <form className="grid md:grid-cols-2 gap-6">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="nombreRazonSocial"
                                value={formData.nombreRazonSocial}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Razón Social
                            </label>
                            {errors.nombreRazonSocial && <span className="text-red-500 text-sm">{errors.nombreRazonSocial}</span>}
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Correo Electrónico
                            </label>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Número Documento
                            </label>
                            {errors.numeroDocumento && <span className="text-red-500 text-sm">{errors.numeroDocumento}</span>}
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <select
                                value={selectedDocumentType}
                                onChange={handleDocumentTypeChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                required
                            >
                                <option value="">Selecciona un tipo de documento</option>
                                {documentTypes.map((docType) => (
                                    <option key={docType.id} value={docType.codigoClasificador}>
                                        {docType.descripcion}
                                    </option>
                                ))}
                            </select>
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Tipo Documento
                            </label>
                            {errors.codigoTipoDocumentoIdentidad && (
                                <span className="text-red-500 text-sm">{errors.codigoTipoDocumentoIdentidad}</span>
                            )}
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="complemento"
                            value={formData.complemento}
                            onChange={handleInputChange}
                            disabled={['3', '5'].includes(formData.codigoTipoDocumentoIdentidad.toString())} 
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />

                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Complemento
                            </label>
                            {errors.complemento && <span className="text-red-500 text-sm">{errors.complemento}</span>}
                        </div>

                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="codigoCliente"
                                value={formData.codigoCliente}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Código Cliente
                            </label>
                            {errors.codigoCliente && <span className="text-red-500 text-sm">{errors.codigoCliente}</span>}
                        </div>
                    </form>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="px-6 py-2 bg-principalColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                            {customer.id ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEditClientModal;