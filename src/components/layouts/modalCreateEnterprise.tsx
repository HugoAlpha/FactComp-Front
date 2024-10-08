import React, { useState, useEffect } from 'react';
import { FaBuilding, FaIdCard } from 'react-icons/fa';

interface Enterprise {
    id: number;
    nit: string;
    razonSocial: string;
}

interface EnterpriseModalProps {
    isOpen: boolean;
    onClose: () => void;
    enterprise: Enterprise;
    onSave: (enterprise: Enterprise) => void;
}

const CreateEditEnterpriseModal: React.FC<EnterpriseModalProps> = ({ isOpen, onClose, enterprise, onSave }) => {
    const [formData, setFormData] = useState<Enterprise>(enterprise);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        setFormData(enterprise);
        setErrors({});
    }, [enterprise, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nit) newErrors.nit = 'Este campo es requerido';
        if (!formData.razonSocial) newErrors.razonSocial = 'Este campo es requerido';
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {enterprise.id ? 'Edición de Empresa' : 'Agregación de Empresa'}
                </div>
                <form className="grid md:grid-cols-2 gap-6 mt-4">
                    {renderInputField("nit", "NIT", formData.nit, handleInputChange, <FaIdCard />, errors.nit)}
                    {renderInputField("razonSocial", "Razón Social", formData.razonSocial, handleInputChange, <FaBuilding />, errors.razonSocial)}
                </form>

                <div className="flex justify-end mt-6">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2"
                    >
                        {enterprise.id ? 'Actualizar' : 'Agregar'}
                    </button>
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
    <div className="relative z-0 w-full mb-5 group">
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
        />
        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            {label}
        </label>
        <span className="absolute right-0 top-3 text-gray-400">{icon}</span>
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
);

export default CreateEditEnterpriseModal;