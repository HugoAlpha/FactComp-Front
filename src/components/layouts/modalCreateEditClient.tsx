import React, { useState, useEffect } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface Customer {
    id: number;
    nombreRazonSocial: string;
    numeroDocumento: string;
    complemento: string;
    codigoTipoDocumentoIdentidad: number;
    codigoCliente: string;
    email: string;
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
    const [tipoDocumento, setTipoDocumento] = useState<string>(customer.codigoTipoDocumentoIdentidad === 0 ? 'NIT' : 'CI');

    useEffect(() => {
        setFormData(customer);
        setErrors({});
    }, [customer, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleTipoDocumentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTipo = e.target.value;
        setTipoDocumento(selectedTipo);

        const codigoTipoDocumentoIdentidad = selectedTipo === 'NIT' ? 0 : 1;
        setFormData((prevData) => ({ ...prevData, codigoTipoDocumentoIdentidad }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nombreRazonSocial) newErrors.nombreRazonSocial = 'Este campo es requerido';
        if (!formData.numeroDocumento) newErrors.numeroDocumento = 'Este campo es requerido';
        if (!formData.codigoCliente) newErrors.codigoCliente = 'Este campo es requerido';
        if (!formData.email) newErrors.email = 'Este campo es requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
            onClose();
        } else {
            Swal.fire('Error', 'Por favor, complete los campos obligatorios.', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-500">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {customer.id ? 'Edición de Cliente' : 'Agregar nuevo Cliente'}
                </div>
                <div className="p-6 m-6">
                    <form className="grid md:grid-cols-2 gap-6">
                        {/* Razón Social */}
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
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Razón Social
                            </label>
                            {errors.nombreRazonSocial && <span className="text-red-500 text-sm">{errors.nombreRazonSocial}</span>}
                        </div>

                        {/* Correo Electrónico */}
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
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Correo Electrónico
                            </label>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                        </div>

                        {/* Número Documento */}
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
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Número Documento
                            </label>
                            {errors.numeroDocumento && <span className="text-red-500 text-sm">{errors.numeroDocumento}</span>}
                        </div>

                        {/* Tipo Documento */}
                        <div className="relative z-0 w-full mb-5 group">
                            <select
                                value={tipoDocumento}
                                onChange={handleTipoDocumentoChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                required
                            >
                                <option value="NIT">NIT</option>
                                <option value="CI">CI</option>
                            </select>
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Tipo Documento
                            </label>
                        </div>

                        {/* Complemento */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="complemento"
                                value={formData.complemento}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Complemento
                            </label>
                            {errors.complemento && <span className="text-red-500 text-sm">{errors.complemento}</span>}
                        </div>

                        {/* Código Cliente */}
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
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Código Cliente
                            </label>
                            {errors.codigoCliente && <span className="text-red-500 text-sm">{errors.codigoCliente}</span>}
                        </div>
                    </form>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                            {customer.id ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEditClientModal;
