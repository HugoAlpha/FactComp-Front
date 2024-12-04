"use client";
import { FaTrashAlt, FaEdit, FaSearch, FaPlus } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import ModalContingency from '@/components/layouts/modalContingency';
import { useEffect, useState } from 'react';
import ModalCreateUser from "../../components/layouts/modalCreateUser";
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND, PATH_URL_SECURITY } from '@/utils/constants';
import Footer from '@/components/commons/footer';
interface User {
    id: number;           
    username: string;      
    nombre: string;        
    apellidos: string;     
    email: string;        
    id_empresa: number;   
    rol: "ROLE_USER" | "ROLE_ADMIN" | "ROLE_CONTADOR";
    celular?: string ;
}
interface Company {
    id: number;
    razonSocial: string;
}

const UserList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);
    const filteredUsers = users.filter(user =>
        `${user.nombre} ${user.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("tokenJWT");
    
            const userResponse = await fetch(`${PATH_URL_SECURITY}/api/usuarios`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            let usersData = await userResponse.json();
    
            const companyResponse = await fetch(`${PATH_URL_BACKEND}/empresa`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const companiesData = await companyResponse.json();

            usersData = usersData.sort((a:User, b:User) => b.id - a.id);
    
            setUsers(usersData);
            setCompanies(companiesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

    useEffect(() => {
        fetchUsers();
    }, []);
    const getCompanyName = (companyId: number) => {
        const company = companies.find(c => c.id === companyId);
        return company ? company.razonSocial : "Empresa no encontrada";
    };

    const handleConfirm = (eventoDescripcion: string) => {
        console.log("Evento confirmado:", eventoDescripcion);
        setIsContingencyModalOpen(false);
    };

    const handleDeleteUser = async (userId: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: {
                confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("tokenJWT");

                try {
                    const response = await fetch(`${PATH_URL_SECURITY}/api/usuarios/delete/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                        Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente.', 'success');
                    } else {
                        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Ocurrió un problema al intentar eliminar el usuario.', 'error');
                    console.error("Error deleting user:", error);
                }
            }
        });
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
                            setIsContingencyModalOpen(true);
                        } else {
                            console.log('Modo de contingencia cancelado.');
                        }
                    });
                } else {
                    console.error("Error de comunicación con el servidor:", response.statusText);
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
                    setIsContingencyModalOpen(true);
                } else {
                    console.log('Modo de contingencia cancelado.');
                }
            });
        }
    };

    useEffect(() => {
        checkServerCommunication();
    }, []);

    const closeModal = () => {
        setIsContingencyModalOpen(false);
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };


    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const openCreateUserModal = () => {
        setCurrentUser(undefined);
        setIsModalOpen(true);
    };

    const handleSaveUser = () => {
        fetchUsers();
        setIsModalOpen(false);
        setCurrentUser(undefined);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 4;
    
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
    
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
    
        return pageNumbers;
    };
    

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Usuarios</h1>
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
                            <div className='flex justify-center'>
                                <button
                                    className="bg-principalColor text-white h-10 px-4 rounded-lg hover:bg-firstColor text-lg flex items-center justify-center"
                                    onClick={openCreateUserModal}
                                >
                                    Agregar Usuario <FaPlus className="inline-block ml-2 size-3" />
                                </button>
                            </div>

                            <ModalCreateUser
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onSave={handleSaveUser}
                                user={currentUser}
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
                                        <th className="px-6 py-4 font-bold">Rol</th> 
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{user.username}</td>
                                            <td className="px-6 py-4">{user.nombre} {user.apellidos}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{getCompanyName(user.id_empresa)}</td>
                                            <td className="px-6 py-4">
                                                {user.rol === "ROLE_USER" ? "Cajero" : user.rol === "ROLE_ADMIN" ? "Administrador" : user.rol === "ROLE_CONTADOR" ? "Contador" : "Sin rol"} 
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex">
                                                    <button className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300 relative group"
                                                        onClick={() => handleDeleteUser(user.id)}>
                                                        <FaTrashAlt className="text-black" />
                                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                                                            Borrar Usuario
                                                        </span>
                                                    </button>

                                                    <button
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300 relative group"
                                                        onClick={() => {
                                                            setCurrentUser(user);
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        <FaEdit className="text-black" />
                                                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                                                            Editar Usuario
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col items-center mt-6">
                            <div className="flex justify-center space-x-1 mb-2">
                                <button
                                    onClick={handleFirstPage}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Primero
                                </button>

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Ant.
                                </button>

                                {getPageNumbers().map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 ${currentPage === number ? 'bg-slate-800 text-white' : ''}`}
                                    >
                                        {number}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Sig.
                                </button>
                                <button
                                    onClick={handleLastPage}
                                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                >
                                    Último
                                </button>
                            </div>

                            <div className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-2">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <ModalContingency 
            isOpen={isContingencyModalOpen} 
            onClose={closeModal} 
            onConfirm={handleConfirm} 
            />
        </div>
    );
};

export default UserList;
