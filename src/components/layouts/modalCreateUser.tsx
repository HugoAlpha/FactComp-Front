import React, { useState, useEffect } from 'react';
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaBriefcase } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface User {
    id: number;
    username: string;
    fullName: string;
    companyId: string;
    branch: string;
    email: string;
    phone: string;
}

interface ModalCreateUserProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    user?: User;
}

const ModalCreateUser: React.FC<ModalCreateUserProps> = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState<User>(user || {
        id: 0,
        username: '',
        fullName: '',
        companyId: '',
        branch: '',
        email: '',
        phone: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                id: 0,
                username: '',
                fullName: '',
                companyId: '',
                branch: '',
                email: '',
                phone: '',
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.username) newErrors.username = 'Este campo es requerido';
        if (!formData.fullName) newErrors.fullName = 'Este campo es requerido';
        if (!formData.companyId) newErrors.companyId = 'Este campo es requerido';
        if (!formData.branch) newErrors.branch = 'Este campo es requerido';
        if (!formData.email) newErrors.email = 'Este campo es requerido';
        if (!formData.phone) newErrors.phone = 'Este campo es requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
            onClose();
            Swal.fire('Usuario Creado', 'El usuario ha sido creado con éxito', 'success');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg w-500 p-6">
                <div className="bg-blue-700 text-white text-lg font-semibold p-4 rounded-t">
                    {user ? 'Edición de Usuario' : 'Creación de Usuario'}
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 text-black">
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("username", "Nombre de Usuario", formData.username, handleInputChange, <FaUser />, errors.username)}
                            {renderInputField("fullName", "Nombre Completo", formData.fullName, handleInputChange, <FaIdCard />, errors.fullName)}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("companyId", "ID de Empresa", formData.companyId, handleInputChange, <FaBriefcase />, errors.companyId)}
                            {renderInputField("branch", "Sucursal", formData.branch, handleInputChange, <FaBriefcase />, errors.branch)}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("email", "Correo", formData.email, handleInputChange, <FaEnvelope />, errors.email)}
                            {renderInputField("phone", "Teléfono", formData.phone, handleInputChange, <FaPhone />, errors.phone)}
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                            {user ? 'Actualizar' : 'Agregar'}
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

export default ModalCreateUser;
