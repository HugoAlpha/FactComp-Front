import React, { useState, useEffect } from 'react';
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { PATH_URL_SECURITY } from '@/utils/constants';

interface User {
    id: number;
    username: string;
    nombre: string;
    apellidos: string;
    password?: string;
    email: string;
    id_empresa: number;
    celular: number;
    rol: string;
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
        nombre: '',
        apellidos: '',
        password: '',
        email: '',
        id_empresa: 1,
        celular: 0,
        rol: 'ROLE_USER',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                id: 0,
                username: '',
                nombre: '',
                apellidos: '',
                password: '',
                email: '',
                id_empresa: 1,
                celular: 0,
                rol: 'ROLE_USER',
            });
        }
        setErrors({});
    }, [user, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const namePattern = /^[a-zA-Z\s]+$/;
        const alphanumericPattern = /^[a-zA-Z0-9]+$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const numberPattern = /^[0-9]+$/;
    
        if (!formData.username) {
            newErrors.username = 'Este campo es requerido.';
        } else if (!alphanumericPattern.test(formData.username)) {
            newErrors.username = 'Solo se permiten letras y espacios.';
        } else if (formData.username.length > 20) {
            newErrors.username = 'Número de caracteres permitido: 20.';
        }
    
        if (!formData.nombre) {
            newErrors.nombre = 'Este campo es requerido.';
        } else if (!namePattern.test(formData.nombre)) {
            newErrors.nombre = 'Solo se permiten letras y espacios.';
        } else if (formData.nombre.length > 35) {
            newErrors.nombre = 'Número de caracteres permitido: 35.';
        }
    
        if (!formData.apellidos) {
            newErrors.apellidos = 'Este campo es requerido.';
        } else if (!namePattern.test(formData.apellidos)) {
            newErrors.apellidos = 'Solo se permiten letras y espacios.';
        } else if (formData.apellidos.length > 35) {
            newErrors.apellidos = 'Número de caracteres permitido: 35.';
        }
    
        if (formData.email) {
            if (!emailPattern.test(formData.email)) {
                newErrors.email = 'El formato del correo electrónico es inválido.';
            } else if (formData.email.length > 50) {
                newErrors.email = 'Número de caracteres permitido: 50.';
            }
        }
    
        if (!formData.celular) {
            newErrors.celular = 'Este campo es requerido.';
        } else if (!numberPattern.test(formData.celular.toString())) {
            newErrors.celular = 'Solo se permiten números.';
        } else if (formData.celular.toString().length > 15) {
            newErrors.celular = 'Número de caracteres permitido: 15.';
        }
    
        // if (!user && (!formData.password || formData.password.trim() === '')) {
        //     newErrors.password = 'Este campo es requerido.';
        // } else if (formData.password && formData.password.length > 20) {
        //     newErrors.password = 'Número de caracteres permitido: 20.';
        // }
    
        if (!formData.rol) {
            newErrors.rol = 'Debe seleccionar un rol de usuario.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    


    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const token = localStorage.getItem("tokenJWT");
                let response;
    
                const requestData = user?.id
                    ? { 
                        username: formData.username, 
                        nombre: formData.nombre, 
                        apellidos: formData.apellidos, 
                        email: formData.email, 
                        id_empresa: formData.id_empresa, 
                        celular: formData.celular, 
                        rol: formData.rol 
                    }
                    : formData; 
    
                if (user?.id) {
                    response = await fetch(`${PATH_URL_SECURITY}/api/usuarios/update/${user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(requestData),
                    });
                } else {
                    response = await fetch(`${PATH_URL_SECURITY}/api/usuarios/createUser`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(requestData),
                    });
                }
    
                if (response.ok) {
                    const savedUser = await response.json();
                    onSave(savedUser);
                    onClose();
                    Swal.fire({
                        icon: 'success',
                        title: user?.id ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.',
                        text: '',
                    });
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar el usuario.', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
            }
        } else {
            Swal.fire('Error', 'Por favor, complete los campos obligatorios correctamente.', 'error');
        }
    };
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg w-1/3">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {user ? 'Edición de Usuario' : 'Creación de Usuario'}
                </div>
                <div className="p-6 m-6">
                    <form className="grid grid-cols-2 gap-6">
                        {renderInputField("username", "Nombre de Usuario", formData.username, handleInputChange, <FaUser />, errors.username)}
                        {renderInputField("nombre", "Nombre", formData.nombre, handleInputChange, <FaIdCard />, errors.nombre)}
                        {renderInputField("apellidos", "Apellidos", formData.apellidos, handleInputChange, <FaIdCard />, errors.apellidos)}
                        {renderInputField("email", "Correo", formData.email, handleInputChange, <FaEnvelope />, errors.email)}
                        {renderInputField("celular", "Teléfono", formData.celular.toString(), handleInputChange, <FaPhone />, errors.celular)}
                        {!user && renderInputField("password", "Contraseña", formData.password || '', handleInputChange, <FaLock />, errors.password)}

                        <div className="relative z-0 w-full mb-5 group">
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                required
                            >
                                <option value="ROLE_USER">Cajero</option>
                                <option value="ROLE_ADMIN">Administrador</option>
                            </select>
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Rol de Usuario
                            </label>
                        </div>
                    </form>
                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="px-6 py-2 bg-principalColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
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
    error?: string,
) => (
    <div className="relative z-0 w-full mb-5 group">
        <input
            type={name === "password" ? "password" : "text"}
            name={name}
            value={value}
            onChange={onChange}
            className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${error ? 'border-red-500' : ''}`}
            placeholder=" "
        />
        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            {label}
        </label>
        {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
);

export default ModalCreateUser;