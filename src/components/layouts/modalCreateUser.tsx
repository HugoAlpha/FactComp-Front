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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-500">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {user ? 'Edición de Usuario' : 'Creación de Usuario'}
                </div>
                <div className="p-6 m-6">
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
                        <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
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
    <div className="relative z-0 w-full mb-5 group">
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${error ? 'border-red-500' : ''}`}
            placeholder=" "
            required
        />
        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            {label}
        </label>
        {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
);

export default ModalCreateUser;
