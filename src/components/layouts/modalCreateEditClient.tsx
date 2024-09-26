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
    const [tipoDocumento, setTipoDocumento] = useState<string>(customer.codigoTipoDocumentoIdentidad === 0 ? "NIT" : "CI");

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

        // Ajustar el valor de codigoTipoDocumentoIdentidad en función del tipo seleccionado
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
                <div className="bg-green-700 text-white text-lg font-semibold p-4 rounded-t">
                    {customer.id ? 'Edición de Cliente' : 'Agregación de Cliente'}
                </div>
                <div className="p-6 m-6">
                    <div className="grid grid-cols-1 gap-6 text-black">
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("nombreRazonSocial", "Razón Social", formData.nombreRazonSocial, handleInputChange, <FaUser />, errors.nombreRazonSocial)}
                            {renderInputField("numeroDocumento", "Número Documento", formData.numeroDocumento, handleInputChange, <FaIdCard />, errors.numeroDocumento)}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("complemento", "Complemento", formData.complemento, handleInputChange, <FaFileAlt />, errors.complemento)}

                            {/* Dropdown para seleccionar tipo de documento */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-1">Tipo Documento</label>
                                <div className="flex items-center border rounded">
                                    <span className="p-2 text-gray-600"><FaFileAlt /></span>
                                    <select
                                        value={tipoDocumento}
                                        onChange={handleTipoDocumentoChange}
                                        className="w-full p-2 border-0 rounded focus:ring-0"
                                    >
                                        <option value="NIT">NIT</option>
                                        <option value="CI">CI</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("codigoCliente", "Código Cliente", formData.codigoCliente, handleInputChange, <FaFileAlt />, errors.codigoCliente)}
                            {renderInputField("email", "Correo Electrónico", formData.email, handleInputChange, <FaEnvelope />, errors.email)}
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                            {customer.id ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const renderInputField = (
    name: string,
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    icon: React.ReactNode,
    error?: string
) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <div className="flex items-center border rounded">
            <span className="p-2 text-gray-600">{icon}</span>
            <input
                type="text"
                name={name}
                className={`border-0 p-2 w-full rounded focus:ring-0 ${error ? 'border-red-500' : ''}`}
                placeholder={`Ingrese ${label.toLowerCase()}`}
                value={value}
                onChange={onChange}
            />
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
);

export default CreateEditClientModal;
