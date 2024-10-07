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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-500">
                <div className="bg-green-700 text-white text-lg font-semibold p-4 rounded-t">
                    {enterprise.id ? 'Edición de Empresa' : 'Agregación de Empresa'}
                </div>
                <div className="p-6 m-6">
                    <div className="grid grid-cols-1 gap-6 text-black">
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("nit", "NIT", formData.nit, handleInputChange, <FaIdCard />, errors.nit)}
                            {renderInputField("razonSocial", "Razón Social", formData.razonSocial, handleInputChange, <FaBuilding />, errors.razonSocial)}
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                            {enterprise.id ? 'Actualizar' : 'Agregar'}
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

export default CreateEditEnterpriseModal;
