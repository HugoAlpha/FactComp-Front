"use client";
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { useState } from 'react';
import ModalCreateUser from "../../components/layouts/modalCreateUser";

const UserList = () => {
    const [users, setUsers] = useState([
        { id: 1, username: 'juanp', fullname: 'Juan Pérez', companyId: 'Empresa 1', branch: 'Sucursal 1' },
        { id: 2, username: 'marial', fullname: 'Maria Lopez', companyId: 'Empresa 2', branch: 'Sucursal 2' },
        { id: 3, username: 'pedros', fullname: 'Pedro Sanchez', companyId: 'Empresa 3', branch: 'Sucursal 3' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);


    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Contenido principal */}
            <div className="flex flex-col w-full min-h-screen">
                {/* Header */}
                <Header />

                {/* Contenido principal */}
                <div className="p-6 bg-gray-50 h-screen w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Usuarios</h1>

                    {/* Barra de búsqueda */}
                    <div className="flex justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar usuario por nombre completo..."
                            className="border p-2 rounded-lg w-1/3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-lg"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Agregar Usuario
                        </button>
                        <ModalCreateUser
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={(newUser) => {
                                // lógica para guardar nuevo usuario
                            }}
                        />
                    </div>

                    {/* Tabla de usuarios */}
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Nombre de Usuario</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Nombre completo</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Id empresa</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Sucursal</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Operaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="px-4 py-4 text-gray-800">{user.username}</td>
                                    <td className="px-4 py-4 text-gray-800">{user.fullname}</td>
                                    <td className="px-4 py-4 text-gray-800">{user.companyId}</td>
                                    <td className="px-4 py-4 text-gray-800">{user.branch}</td>
                                    <td className="px-4 py-4 flex space-x-2">
                                        {/* Iconos de Borrar y Editar */}
                                        <button className="text-red-500 hover:text-red-700">
                                            <FaTrashAlt />
                                        </button>
                                        <button className="text-blue-500 hover:text-blue-700">
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="mt-4 flex justify-between">
                        <button className="text-gray-600">Previous</button>
                        <div className="space-x-2">
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">1</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">2</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">3</button>
                        </div>
                        <button className="text-gray-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
