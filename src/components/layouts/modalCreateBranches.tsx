import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Empresa {
    id: number;
    razonSocial: string;
}

interface ModalCreateBranchProps {
    isOpen: boolean;
    onClose: () => void;
    onBranchCreated: (newBranch: any) => void;
    branchToEdit: any | null;
}

const ModalCreateBranch: React.FC<ModalCreateBranchProps> = ({ isOpen, onClose, onBranchCreated, branchToEdit }) => {
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [empresaId, setEmpresaId] = useState<number | null>(null);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);

    const [errors, setErrors] = useState({
        codigo: '',
        nombre: '',
        departamento: '',
        municipio: '',
        direccion: '',
        telefono: '',
        empresa: ''
    });

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/empresa`);
                if (!response.ok) {
                    throw new Error('Error al cargar empresas');
                }
                const data = await response.json();
                setEmpresas(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (isOpen) {
            fetchEmpresas();

            if (branchToEdit) {
                setCodigo(branchToEdit.codigo || '');
                setNombre(branchToEdit.nombre || '');
                setDepartamento(branchToEdit.departamento || '');
                setMunicipio(branchToEdit.municipio || '');
                setDireccion(branchToEdit.direccion || '');
                setTelefono(branchToEdit.telefono || '');
                setEmpresaId(branchToEdit.empresaId || null);
            } else {
                setCodigo('');
                setNombre('');
                setDepartamento('');
                setMunicipio('');
                setDireccion('');
                setTelefono('');
                setEmpresaId(null);
            }
        }
    }, [isOpen, branchToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            case 'empresa':
                setEmpresaId(Number(value));
                break;
            default:
                break;
        }
    };

    const handleSaveBranch = async () => {
        if (!empresaId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar una empresa.',
            });
            return;
        }

        const body = {
            codigo,
            nombre,
            departamento,
            municipio,
            direccion,
            telefono,
            empresa: { id: empresaId }
        };

        try {
            const method = branchToEdit ? 'PUT' : 'POST';
            const endpoint = branchToEdit ? `${PATH_URL_BACKEND}/sucursales/${branchToEdit.id}` : `${PATH_URL_BACKEND}/sucursales`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la sucursal');
            }

            const newBranch = await response.json();
            onBranchCreated(newBranch);

            Swal.fire({
                icon: 'success',
                title: branchToEdit ? 'Sucursal actualizada' : 'Sucursal creada',
                text: branchToEdit ? 'La sucursal fue actualizada correctamente.' : 'La sucursal fue creada correctamente.',
            });

            onClose();
        } catch (error) {
            console.error("Error al guardar la sucursal:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la sucursal.',
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {branchToEdit ? 'Editar Sucursal' : 'Agregar Nueva Sucursal'}
                </div>
                <form className="grid md:grid-cols-2 gap-6 mt-4">
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
                    </div>

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
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            name="departamento"
                            value={departamento}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        >
                            <option value="">Seleccionar Departamento</option>
                            <option value="La Paz">La Paz</option>
                            <option value="Santa Cruz">Santa Cruz</option>
                            <option value="Cochabamba">Cochabamba</option>
                            <option value="Potosi">Potosi</option>
                            <option value="Sucre">Sucre</option>
                            <option value="Oruro">Oruro</option>
                            <option value="Tarija">Tarija</option>
                            <option value="Pando">Pando</option>
                            <option value="Beni">Beni</option>
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Departamento
                        </label>
                    </div>

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
                    </div>

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
                    </div>

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
                    </div>

                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            name="empresa"
                            value={empresaId ?? ''}
                            onChange={handleChange}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            required
                        >
                            <option value="">Seleccionar Empresa</option>
                            {empresas.map((empresa) => (
                                <option key={empresa.id} value={empresa.id}>
                                    {empresa.razonSocial}
                                </option>
                            ))}
                        </select>
                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Empresa
                        </label>
                    </div>
                </form>

                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                        Cancelar
                    </button>
                    <button onClick={handleSaveBranch} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                        {branchToEdit ? 'Actualizar Sucursal' : 'Crear Sucursal'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateBranch;
