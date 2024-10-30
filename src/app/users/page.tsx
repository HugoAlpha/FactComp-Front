"use client";
import { FaTrashAlt, FaEdit, FaSearch } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { useEffect, useState } from 'react';
import ModalCreateUser from "../../components/layouts/modalCreateUser";
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND, PATH_URL_SECURITY } from '@/utils/constants';

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const filteredUsers = users.filter(user =>
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
    );    

    useEffect(() => {
        const fetchUsersAndCompanies = async () => {
            try {
                const token = localStorage.getItem("tokenJWT");

                const userResponse = await fetch(`${PATH_URL_SECURITY}/api/usuarios`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const usersData = await userResponse.json();

                const companyResponse = await fetch(`${PATH_URL_BACKEND}/empresa`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const companiesData = await companyResponse.json();

                setUsers(usersData);
                setCompanies(companiesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUsersAndCompanies();
    }, []);

    const getCompanyName = (companyId: number) => {
        const company = companies.find(c => c.id === companyId);
        return company ? company.razonSocial : "Empresa no encontrada";
    };

    const checkServerCommunication = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/verificar-comunicacion`);
            if (!response.ok) {
                if (response.status === 500) {
                    Swal.fire({
                        title: 'La comunicación con impuestos falló',
                        text: '¿Desea entrar en modo de contingencia?',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                            cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log('Modo de contingencia aceptado.');
                        } else {
                            console.log('Modo de contingencia cancelado.');
                        }
                    });
                } else {
                   
                }
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire({
                title: 'La comunicación con impuestos falló',
                text: '¿Desea entrar en modo de contingencia?',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                    cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Modo de contingencia aceptado.');
                } else {
                    console.log('Modo de contingencia cancelado.');
                }
            });
        }
    };

    useEffect(() => {
        checkServerCommunication();
    }, []);

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };
    

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 4;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Contenido principal */}
            <div className="flex flex-col w-full min-h-screen">
                {/* Header */}
                <Header />

                {/* Contenido principal */}
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Usuarios</h1>

                        {/* Barra de búsqueda */}
                        <div className="flex justify-between mb-4">

                            <div>
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border px-2 h-10 rounded-lg w-20"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={40}>40</option>
                                    <option value={50}>50</option>
                                </select>

                            </div>

                            <div className="relative flex items-center w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Buscar usuario por nombre completo..."
                                    className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 h-10 rounded-lg w-full shadow-sm text-sm placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <FaSearch className="absolute right-4 text-gray-500 text-xl pointer-events-none" />
                            </div>
                            <button
                                className="bg-sixthColor text-white h-10 px-4 rounded-lg hover:bg-fourthColor text-lg"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Agregar Usuario
                            </button>
                            <ModalCreateUser
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onSave={(newUser) => {
                                }}
                            />
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Nombre de Usuario</th>
                                        <th className="px-6 py-4 font-bold">Nombre completo</th>
                                        <th className="px-6 py-4 font-bold">Email</th>
                                        <th className="px-6 py-4 font-bold">Empresa</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((user) => (
                                        <tr key={user.id_user} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{user.username}</td>
                                            <td className="px-6 py-4">{user.nombre} {user.apellidos}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{getCompanyName(user.id_empresa)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    {/* Botón de Borrar */}
                                                    <button className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300">
                                                        <FaTrashAlt className="text-black" />
                                                    </button>

                                                    {/* Botón de Editar */}
                                                    <button className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300">
                                                        <FaEdit className="text-black" />
                                                    </button>
                                                </div>
                                            </td>



                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Ant.
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'} focus:bg-slate-800 focus:text-white active:border-slate-800 active:bg-slate-800`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Sig.
                            </button>
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
