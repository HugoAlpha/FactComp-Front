import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFileInvoice, FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaHome, FaUsers, FaBuilding } from 'react-icons/fa';
import { MdOutlinePointOfSale, MdVerified } from "react-icons/md";
import { HiDocumentCheck } from "react-icons/hi2";
import { PiStorefrontFill } from "react-icons/pi";

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [isOpen, setIsOpen] = useState(true);
    const [activeLink, setActiveLink] = useState(null);

    useEffect(() => {
        const storedActiveLink = localStorage.getItem('activeLink');
        if (storedActiveLink) {
            setActiveLink(storedActiveLink);
        }
    }, []);

    const toggleMenu = (menuName) => {
        setOpenMenu(prev => (prev === menuName ? null : menuName));
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
        localStorage.setItem('activeLink', link);
    };

    const menuItems = [
        {
            name: 'Documentos',
            icon: <FaFileInvoice size={20} />,
            subItems: [
                { name: 'Factura', href: 'bill' },
                { name: 'Nota DC', href: '#' }
            ]
        },
        {
            name: 'Gestión POS',
            icon: <FaUser size={20} />,
            subItems: [
                { name: 'Clientes', href: 'clientList' },
                { name: 'Productos', href: 'products' }
            ]
        },
        {
            name: 'Puntos',
            icon: <PiStorefrontFill size={20} />,
            subItems: [
                { name: 'Puntos de venta', href: 'puntoVenta' },
                { name: 'Sucursales', href: 'branches' }
            ]
        },
        {
            name: 'Certificación',
            icon: <MdVerified size={20} />,
            subItems: [
                { name: 'CUIS', href: 'codecuis' },
                { name: 'CUFD', href: 'codecufd' }
            ]
        },
        //{
        //  name: 'Parámetros',
        //icon: <FaFileInvoice size={20} />,
        //subItems: [
        //    { name: 'Submenú 1', href: '#' },
        //  { name: 'Submenú 2', href: '#' }
        //]
        //},
        {
            name: 'Configuración SIAT',
            icon: <HiDocumentCheck size={20} />,
            subItems: [
                //{ name: 'Actividades', href: 'activities' },
                { name: 'Leyendas', href: 'legends' },
                { name: 'Parámetros', href: 'parameters' }
            ]
        }
    ];

    return (
        <div className="flex min-h-screen">
            <div className="md:hidden">
                <button onClick={toggleSidebar} className="p-4 text-white bg-gray-800">
                    <FaBars />
                </button>
            </div>

            <aside className={`bg-principalColor text-white min-h-screen fixed md:relative z-10 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'}`}>
                <div className="p-4 flex flex-col h-full">
                    {/* Botón para colapsar la barra lateral */}
                    <div className={`flex ${isOpen ? 'justify-end' : 'justify-center'} mb-2`}>
                        <button className='text-white' onClick={toggleSidebar}>
                            <FaBars size={24} />
                        </button>
                    </div>
                    {/* Imagen del logo */}
                    <div className={`mb-6 ${isOpen ? 'block' : 'hidden'}`}>
                        <Image
                            src="/images/LogoIdAlpha2.png"
                            alt="Logo"
                            width={250}
                            height={150}
                            className="mx-auto"
                        />
                    </div>
                    {/* Menú de navegación */}
                    <nav className="flex-grow">
                        <ul className="space-y-2">
                            {/* Enlace al dashboard */}
                            <li>
                                <Link href="dashboard"
                                    className={`block p-2 font-bold hover:bg-firstColor rounded-lg ${activeLink === '/dashboard' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`}
                                    onClick={() => handleLinkClick('/dashboard')}>
                                    <span className="flex items-center">
                                        <div className="w-6 h-6 flex justify-center items-center">
                                            <FaHome size={20} />
                                        </div>
                                        {isOpen && <span className="ml-2">Inicio</span>}
                                    </span>
                                </Link>
                            </li>
                            {/* Enlace a Nueva Venta */}
                            <li>
                                <Link href="sales"
                                    className={`block p-2 font-bold hover:bg-firstColor rounded-lg ${activeLink === '/sales' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`}
                                    onClick={() => handleLinkClick('/sales')}>
                                    <span className="flex items-center">
                                        <div className="w-6 h-6 flex justify-center items-center">
                                            <MdOutlinePointOfSale size={20} />
                                        </div>
                                        {isOpen && <span className="ml-2">Nueva Venta</span>}
                                    </span>
                                </Link>
                            </li>

                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className="flex items-center justify-between w-full p-2 text-left font-bold hover:bg-firstColor rounded-lg"
                                    >
                                        <span className="flex items-center">
                                            <div className="w-6 h-6 flex justify-center items-center">
                                                {item.icon}
                                            </div>
                                            {isOpen && <span className="ml-2">{item.name}</span>}
                                        </span>
                                        {isOpen && <FaChevronDown className={`transition-transform duration-200 ${openMenu === item.name ? 'transform rotate-180' : ''}`} />}
                                    </button>
                                    {isOpen && openMenu === item.name && (
                                        <ul className="ml-4 mt-2 space-y-2">
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link href={subItem.href}
                                                        className={`block p-2 pl-4 hover:bg-firstColor rounded-lg ${activeLink === subItem.href ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`}
                                                        onClick={() => handleLinkClick(subItem.href)}>
                                                        {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}

                            {/* Enlace a Usuarios */}
                            <li>
                                <Link href="users"
                                    className={`block p-2 font-bold hover:bg-firstColor rounded-lg ${activeLink === '/users' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`}
                                    onClick={() => handleLinkClick('/users')}>
                                    <span className="flex items-center">
                                        <div className="w-6 h-6 flex justify-center items-center">
                                            <FaUsers size={20} />
                                        </div>
                                        {isOpen && <span className="ml-2">Usuarios</span>}
                                    </span>
                                </Link>
                            </li>

                            {/* Enlace a Empresa */}
                            <li>
                                <Link href="enterprise"
                                    className={`block p-2 font-bold hover:bg-firstColor rounded-lg ${activeLink === '/enterprise' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`}
                                    onClick={() => handleLinkClick('/enterprise')}>
                                    <span className="flex items-center">
                                        <div className="w-6 h-6 flex justify-center items-center">
                                            <FaBuilding size={20} />
                                        </div>
                                        {isOpen && <span className="ml-2">Empresa</span>}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    {/* Botón de Logout */}
                    <div className="mt-auto">
                        <button className="flex items-center text-white font-bold hover:bg-firstColor p-2 w-full rounded-lg">
                            <div className="w-6 h-6 flex justify-center items-center">
                                <FaSignOutAlt size={20} />
                            </div>
                            {isOpen && <span className="ml-2">Salir</span>}
                        </button>
                    </div>
                </div>
            </aside>

        </div>
    );
};

export default Sidebar;
