"use client";
import { FaFileInvoice, FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaHome } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';

const Sidebar = () => {
    const [isDocumentosOpen, setIsDocumentosOpen] = useState(false);
    const [isInvolucradosOpen, setIsInvolucradosOpen] = useState(false);
    const [isPuntosOpen, setIsPuntosOpen] = useState(false);
    const [isCertificacionOpen, setIsCertificacionOpen] = useState(false);
    const [isParametrosOpen, setIsParametrosOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen ">
            
            <div className="md:hidden">
                <button onClick={toggleSidebar} className="p-4 text-white bg-gray-800">
                    <FaBars />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`bg-gray-800 text-white h-full fixed md:relative z-10 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64 w-64`}>
                <div className="p-4">

                    {/* Agregar el logo arriba de todito pd: malditos colores del logo ptm */}
                    <div className="mb-6">
                        <Image
                            src="/images/LogoIdAlpha.png"
                            alt="Logo"
                            width={250}
                            height={150}
                            className="mx-auto"
                        />
                    </div>

                    <ul className="space-y-2">
                        
                        <li>
                    
                            <a href="dashboard" className="block p-2 hover:bg-gray-700 rounded-lg">
                                <span className="flex items-center">
                                    <FaHome className="mr-2" /> Inicio
                                </span>
                            </a>
                        </li>
                        {/* Documentos */}
                        <li>
                            <button
                                onClick={() => setIsDocumentosOpen(!isDocumentosOpen)}
                                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded-lg"
                            >
                                <span className="flex items-center">
                                    <FaFileInvoice className="mr-2" /> Documentos
                                </span>
                                <FaChevronDown className={`${isDocumentosOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            {isDocumentosOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li>
                                        <a href="bill" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Factura
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Nota DC
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={() => setIsInvolucradosOpen(!isInvolucradosOpen)}
                                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded-lg"
                            >
                                <span className="flex items-center">
                                    <FaUser className="mr-2" /> Gestion post
                                </span>
                                <FaChevronDown className={`${isInvolucradosOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            {isInvolucradosOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li>
                                        <a href="clientList" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Clientes
                                        </a>
                                    </li>
                                    <li>
                                        <a href="products" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Productos
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        
                        <li>
                            <button
                                onClick={() => setIsPuntosOpen(!isPuntosOpen)}
                                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded-lg"
                            >
                                <span className="flex items-center">
                                    <FaFileInvoice className="mr-2" /> Puntos
                                </span>
                                <FaChevronDown className={`${isPuntosOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            {isPuntosOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li>
                                        <a href="puntoVenta" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Puntos de venta
                                        </a>
                                    </li>
                                    <li>
                                        <a href="branches" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Sucursales
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        
                        <li>
                            <button
                                onClick={() => setIsCertificacionOpen(!isCertificacionOpen)}
                                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded-lg"
                            >
                                <span className="flex items-center">
                                    <FaFileInvoice className="mr-2" /> Certificación
                                </span>
                                <FaChevronDown className={`${isCertificacionOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            {isCertificacionOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li>
                                        <a href="#" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Submenú 1
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Submenú 2
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Parámetros */}
                        <li>
                            <button
                                onClick={() => setIsParametrosOpen(!isParametrosOpen)}
                                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded-lg"
                            >
                                <span className="flex items-center">
                                    <FaFileInvoice className="mr-2" /> Parámetros
                                </span>
                                <FaChevronDown className={`${isParametrosOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            {isParametrosOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li>
                                        <a href="#" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Submenú 1
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Submenú 2
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                    
                        <li>
                            <button
                                onClick={() => setIsReportOpen(!isReportOpen)}
                                className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded-lg"
                            >
                                <span className="flex items-center">
                                    <FaFileInvoice className="mr-2" /> Configuracion SIAT
                                </span>
                                <FaChevronDown className={`${isReportOpen ? 'transform rotate-180' : ''}`} />
                            </button>
                            {isReportOpen && (
                                <ul className="ml-4 space-y-2">
                                    <li>
                                        <a href="activities" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Actividades
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                            Leyendas
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>

                    <div className="absolute bottom-4 left-4">
                        <button className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg">
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
