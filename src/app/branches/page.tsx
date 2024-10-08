"use client";
import React, { useState, useEffect } from 'react';
import Header from "@/components/commons/header";
import Sidebar from "@/components/commons/sidebar";
import { FaEdit, FaSearch, FaTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ModalCreateBranch from '@/components/layouts/modalCreateBranches';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface Branch {
    id: number;
    nombre: string;
    departamento: string;
    municipio: string;
    direccion: string;
    telefono: string;
    razonSocial: string;
    empresaId: number;
    codigo: string;
    
}

const Branches: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

    const handleOpenModal = (branch: Branch | null = null) => {
        setSelectedBranch(branch);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const fetchBranches = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/sucursales`);

            if (!response.ok) {
                const errorMessage = `Error: ${response.status} - ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            const formattedData = data.map((branch: any) => ({
                id: branch.id,
                codigo: branch.codigo,
                nombre: branch.nombre,
                departamento: branch.departamento,
                municipio: branch.municipio,
                direccion: branch.direccion,
                telefono: branch.telefono,
                razonSocial: branch.empresa.razonSocial,
                empresaId: branch.empresa.id,
            }));

            setBranches(formattedData);
            setFilteredBranches(formattedData);
        } catch (error: any) {
            console.error("Error al obtener las sucursales:", error.message);
        }
    };


    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        let filtered = branches;

        if (searchTerm) {
            filtered = filtered.filter((branch) =>
                branch.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCity) {
            filtered = filtered.filter((branch) => branch.municipio === selectedCity);
        }

        setFilteredBranches(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedCity, branches]);

    const totalPages = Math.ceil(filteredBranches.length / rowsPerPage);
    const paginatedBranches = filteredBranches.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const getPageNumbers = () => {
        const totalPages = Math.ceil(filteredBranches.length / rowsPerPage);
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

    const handleEditBranch = async (id: number) => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/sucursales/${id}`);
            if (!response.ok) {
                throw new Error("No se pudo obtener la sucursal");
            }
            const branch = await response.json();
            const branchToEdit = {
                id: branch.id,
                codigo: branch.codigo,
                nombre: branch.nombre,
                departamento: branch.departamento,
                municipio: branch.municipio,
                direccion: branch.direccion,
                telefono: branch.telefono,
                empresaId: branch.empresa.id,
                razonSocial: branch.razonSocial,
            };
            handleOpenModal(branchToEdit);
        } catch (error) {
            console.error("Error al obtener la sucursal:", error);
        }
    };



    const handleDeleteBranch = (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${PATH_URL_BACKEND}/sucursales/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error('No se pudo eliminar la sucursal');
                    }
                    fetchBranches();
                    Swal.fire('Eliminado!', 'La sucursal ha sido eliminada.', 'success');
                } catch (error) {
                    console.error("Error al eliminar la sucursal:", error);
                    Swal.fire('Error!', 'No se pudo eliminar la sucursal.', 'error');
                }
            }
        });
    };

    const handleBranchCreatedOrUpdated = () => {
        fetchBranches();
        handleCloseModal();
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-black">Lista de Sucursales</h2>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-sixthColor text-white font-bold py-2 px-4 rounded-lg hover:bg-thirdColor transition duration-200"
                            >
                                Agregar Sucursal
                            </button>
                        </div>
                        <div className="mb-4">
                            
                        </div>
                        <div className="flex justify-between mb-4">
                            <div>
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border px-2 rounded-lg w-20"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <div className='flex justify-center'>
                                <div className="flex items-center">
                                    <label className="mr-2 text-black">Filtrar por Ciudad:</label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="border p-2"
                                    >
                                        <option value="">Todas</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.municipio}>
                                                {branch.municipio}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="relative flex items-center w-full max-w-md">
                               
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por nombre, ciudad, departamento o razón social"
                                    className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm text-sm placeholder-gray-400 ml-2"
                                    style={{width:'600px'}}
                                />
                            <FaSearch className="absolute right-4 text-gray-500 text-xl pointer-events-none" />
                            </div>
                            </div>

                        
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Código</th>
                                        <th className="px-6 py-4 font-bold">Nombre</th>
                                        <th className="px-6 py-4 font-bold">Departamento</th>
                                        <th className="px-6 py-4 font-bold">Municipio</th>
                                        <th className="px-6 py-4 font-bold">Dirección</th>
                                        <th className="px-6 py-4 font-bold">Teléfono</th>
                                        <th className="px-6 py-4 font-bold">Razón Social</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedBranches.map((branch) => (
                                        <tr key={branch.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4 text-black">{branch.codigo}</td>
                                            <td className="px-6 py-4 text-black">{branch.nombre}</td>
                                            <td className="px-6 py-4 text-black">{branch.departamento}</td>
                                            <td className="px-6 py-4 text-black">{branch.municipio}</td>
                                            <td className="px-6 py-4 text-black">{branch.direccion}</td>
                                            <td className="px-6 py-4 text-black">{branch.telefono}</td>
                                            <td className="px-6 py-4 text-black">{branch.razonSocial}</td>
                                            <td className="px-6 py-4 text-black">
                                                <div className="flex">
                                                    <button
                                                        onClick={() => handleDeleteBranch(branch.id)}
                                                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                                                    >
                                                        <FaTrashAlt className="text-black" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditBranch(branch.id)}
                                                        className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                                                    >
                                                        <FaEdit className="text-black" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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

            <ModalCreateBranch
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onBranchCreated={handleBranchCreatedOrUpdated}
                branchToEdit={selectedBranch}
            />
        </div>
    );
};

export default Branches;

