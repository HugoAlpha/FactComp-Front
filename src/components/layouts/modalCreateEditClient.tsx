import React from 'react';
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaFileAlt } from 'react-icons/fa';

interface Customer {
    id: number;
    razonSocial: string;
    nroDocumento: string;
    complemento: string;
    tipoDocumento: string;
    telefono: string;
    correo: string;
}

interface CustomerModalProps {
    isOpen: boolean; 
    onClose: () => void; 
    customer: Customer; 
    onSave: (customer: Customer) => void; 
}

const CreateEditClientModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, customer, onSave }) => {
    const [formData, setFormData] = React.useState<Customer>(customer);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({}); // Estado para almacenar errores

    React.useEffect(() => {
        setFormData(customer);
        setErrors({}); 
    }, [customer, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); 
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.razonSocial) newErrors.razonSocial = 'Este campo es requerido';
        if (!formData.nroDocumento) newErrors.nroDocumento = 'Este campo es requerido';
        if (!formData.complemento) newErrors.complemento = 'Este campo es requerido';
        if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Este campo es requerido';
        if (!formData.telefono) newErrors.telefono = 'Este campo es requerido';
        if (!formData.correo) newErrors.correo = 'Este campo es requerido';

        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0; 
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData); 
            onClose();
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
                            {renderInputField("razonSocial", "Razón Social", formData.razonSocial, handleInputChange, <FaUser />, errors.razonSocial)}
                            {renderInputField("nroDocumento", "Número Documento", formData.nroDocumento, handleInputChange, <FaIdCard />, errors.nroDocumento)}
                        </div>
                        <div className="grid grid-cols-2 gap-6"> 
                            {renderInputField("complemento", "Complemento", formData.complemento, handleInputChange, <FaFileAlt />, errors.complemento)}
                            {renderInputField("tipoDocumento", "Tipo Documento", formData.tipoDocumento, handleInputChange, <FaFileAlt />, errors.tipoDocumento)}
                        </div>
                        <div className="grid grid-cols-2 gap-6"> 
                            {renderInputField("telefono", "Teléfono", formData.telefono, handleInputChange, <FaPhone />, errors.telefono)}
                            {renderInputField("correo", "Correo", formData.correo, handleInputChange, <FaEnvelope />, errors.correo)}
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
        {error && <span className="text-red-500 text-sm">{error}</span>} {/* Mostrar error */}
    </div>
);

export default CreateEditClientModal;
