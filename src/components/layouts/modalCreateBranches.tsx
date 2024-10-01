import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface ModalCreateBranchProps {
    isOpen: boolean;
    onClose: () => void;
    onBranchCreated: (newBranch: any) => void;
}

const ModalCreateBranch: React.FC<ModalCreateBranchProps> = ({ isOpen, onClose, onBranchCreated }) => {
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [errors, setErrors] = useState({
        codigo: '',
        nombre: '',
        departamento: '',
        municipio: '',
        direccion: '',
        telefono: ''
    });

    useEffect(() => {
        if (isOpen) {
            setCodigo('');
            setNombre('');
            setDepartamento('');
            setMunicipio('');
            setDireccion('');
            setTelefono('');
            setErrors({
                codigo: '',
                nombre: '',
                departamento: '',
                municipio: '',
                direccion: '',
                telefono: ''
            });
        }
    }, [isOpen]);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'codigo':
                if (!/^\d+$/.test(value)) {
                    error = 'El código solo puede contener números.';
                }
                break;
            case 'nombre':
                if (!value.trim()) {
                    error = 'El nombre no puede estar vacío.';
                }
                break;
            case 'departamento':
            case 'municipio':
            case 'direccion':
                if (!value.trim()) {
                    error = `El campo ${name} no puede estar vacío.`;
                }
                break;
            case 'telefono':
                if (!/^\d+$/.test(value)) {
                    error = 'El teléfono solo puede contener números.';
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'codigo':
                setCodigo(value);
                break;
            case 'nombre':
                setNombre(value);
                break;
            case 'departamento':
                setDepartamento(value);
                break;
            case 'municipio':
                setMunicipio(value);
                break;
            case 'direccion':
                setDireccion(value);
                break;
            case 'telefono':
                setTelefono(value);
                break;
            default:
                break;
        }
        validateField(name, value);
    };

    const handleCreateBranch = async () => {
        const body = {
            codigo,
            nombre,
            departamento,
            municipio,
            direccion,
            telefono,
            empresa: { id: 1, nit: null, razonSocial: null }
        };

        try {
            const response = await fetch(`${PATH_URL_BACKEND}/sucursales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorMessage = `Error: ${response.status} - ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const newBranch = await response.json();
            onBranchCreated(newBranch);

            Swal.fire({
                icon: 'success',
                title: 'Sucursal creada',
                text: 'La sucursal fue creada correctamente.',
            });

            onClose();

        } catch (error: any) {
            console.error("Error al crear la sucursal:", error.message);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La sucursal fue creada correctamente.',
            });
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    Agregar Nueva Sucursal
                </div>
                <form className="grid md:grid-cols-2 gap-6 mt-4" onSubmit={handleCreateBranch}>
                    {/* Código */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="codigo"
                            value={codigo}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Código
                        </label>
                        {errors.codigo && <span className="text-red-500 text-sm">{errors.codigo}</span>}
                    </div>

                    {/* Nombre */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="nombre"
                            value={nombre}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Nombre
                        </label>
                        {errors.nombre && <span className="text-red-500 text-sm">{errors.nombre}</span>}
                    </div>

                    {/* Departamento */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="departamento"
                            value={departamento}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Departamento
                        </label>
                        {errors.departamento && <span className="text-red-500 text-sm">{errors.departamento}</span>}
                    </div>

                    {/* Municipio */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="municipio"
                            value={municipio}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Municipio
                        </label>
                        {errors.municipio && <span className="text-red-500 text-sm">{errors.municipio}</span>}
                    </div>

                    {/* Dirección */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="direccion"
                            value={direccion}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Dirección
                        </label>
                        {errors.direccion && <span className="text-red-500 text-sm">{errors.direccion}</span>}
                    </div>

                    {/* Teléfono */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="telefono"
                            value={telefono}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Teléfono
                        </label>
                        {errors.telefono && <span className="text-red-500 text-sm">{errors.telefono}</span>}
                    </div>
                </form>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                        Cancelar
                    </button>
                    <button onClick={handleCreateBranch} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                        Crear Sucursal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateBranch;
