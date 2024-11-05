import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
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
            const menuItem = menuItems.find(item =>
                item.subItems && item.subItems.some(subItem => subItem.href === storedActiveLink)
            );
            if (menuItem) {
                setOpenMenu(menuItem.name);
            }
        }
    }, []);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = (link) => {
        setActiveLink(link);
        localStorage.setItem('activeLink', link);
        const menuItem = menuItems.find(item =>
            item.subItems && item.subItems.some(subItem => subItem.href === link)
        );
        if (menuItem) {
            setOpenMenu(menuItem.name);
        } else {
            setOpenMenu(null);
        }
    };


    const menuItems = [
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
        {
            name: 'Configuración SIAT',
            icon: <HiDocumentCheck size={20} />,
            subItems: [
                { name: 'Leyendas', href: 'legends' },
                { name: 'Parámetros', href: 'parameters' }
            ]
        }
    ];

    const facturaItem = {
        name: 'Factura',
        icon: <FaFileInvoice size={20} />,
        href: 'bill'
    };


    const handleMouseEnter = (menuName) => {
        setOpenMenu(menuName);
    };

    const handleMouseLeave = () => {
        setOpenMenu(null);
    };



    return (
        <div className="flex min-h-screen">
            {/* Botón para abrir/cerrar el sidebar en pantallas pequeñas */}
            <div className="md:hidden">
                <button onClick={toggleSidebar} className="p-4 text-white bg-gray-800">
                    <FaBars />
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`bg-principalColor text-white min-h-screen fixed md:relative z-10 transition-all duration-500 ease-in-out ${isOpen ? 'w-64' : 'w-16 overflow-hidden'}`}>
                <div className="p-4 flex flex-col h-full">
                    {/* Botón de alternancia dentro del sidebar */}
                    <div className={`flex ${isOpen ? 'justify-end' : 'justify-center'} mb-2 transition-all duration-500 ease-in-out`}>
                        <button className='text-white' onClick={toggleSidebar}>
                            <FaBars size={24} />
                        </button>
                    </div>
                    <div className={`mb-6 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                        <Image
                            src="/images/LogoIdAlpha2.png"
                            alt="Logo"
                            width={250}
                            height={150}
                            className="mx-auto"
                        />
                    </div>
                    <nav className="flex-grow">
                        <ul className="space-y-2">
                            <li>
                                <Link href="dashboard" className={`block p-2 font-bold hover:bg-firstColor rounded-lg transition-colors duration-300 ${activeLink === '/dashboard' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`} onClick={() => handleLinkClick('/dashboard')}>
                                    <div className="flex items-center">
                                        <FaHome size={20} />
                                        {isOpen && <span className="ml-2">Inicio</span>}
                                    </div>
                                </Link>
                            </li>

                            <li>
                                <Link href="sales" className={`block p-2 font-bold hover:bg-firstColor rounded-lg transition-colors duration-300 ${activeLink === '/sales' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`} onClick={() => handleLinkClick('/sales')}>
                                    <span className="flex items-center">
                                        <div className="w-6 h-6 flex justify-center items-center">
                                            <MdOutlinePointOfSale size={20} />
                                        </div>
                                        {isOpen && <span className="ml-2">Nueva Venta</span>}
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link href={facturaItem.href} className={`block p-2 font-bold hover:bg-firstColor rounded-lg transition-colors duration-300 ${activeLink === 'bill' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`} onClick={() => handleLinkClick('bill')}>
                                    <span className="flex items-center">
                                        <div className="w-6 h-6 flex justify-center items-center">
                                            {facturaItem.icon}
                                        </div>
                                        {isOpen && <span className="ml-2">{facturaItem.name}</span>}
                                    </span>
                                </Link>
                            </li>

                            {menuItems.map((item, index) => (
                                <li key={index} onMouseEnter={() => handleMouseEnter(item.name)} onMouseLeave={handleMouseLeave}>
                                    <button className="flex items-center justify-between w-full p-2 text-left font-bold hover:bg-firstColor rounded-lg transition-colors duration-300">
                                        <span className="flex items-center">
                                            <div className="w-6 h-6 flex justify-center items-center">
                                                {item.icon}
                                            </div>
                                            {isOpen && <span className="ml-2">{item.name}</span>}
                                        </span>
                                        {isOpen && <FaChevronDown className={`transition-transform duration-300 ${openMenu === item.name ? 'rotate-180' : ''}`} />}
                                    </button>
                                    {isOpen && openMenu === item.name && (
                                        <ul className="ml-4 mt-2 space-y-2 transition-all duration-500 ease-in-out transform opacity-100 max-h-screen" style={{ maxHeight: openMenu === item.name ? '500px' : '0', overflow: 'hidden' }}>
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <Link href={subItem.href} className={`block p-2 pl-4 hover:bg-firstColor rounded-lg transition-colors duration-300 ${activeLink === subItem.href ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`} onClick={() => handleLinkClick(subItem.href)}>
                                                        {subItem.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}

                            <li>
                                <Link href="users" className={`block p-2 font-bold hover:bg-firstColor rounded-lg transition-colors duration-300 ${activeLink === '/users' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`} onClick={() => handleLinkClick('/users')}>
                                    <span className="flex items-center">
                                        <div className="w-6 h-6 flex justify-center items-center">
                                            <FaUsers size={20} />
                                        </div>
                                        {isOpen && <span className="ml-2">Usuarios</span>}
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link href="enterprise" className={`block p-2 font-bold hover:bg-firstColor rounded-lg transition-colors duration-300 ${activeLink === '/enterprise' ? 'bg-white bg-opacity-20 text-ninthColor' : ''}`} onClick={() => handleLinkClick('/enterprise')}>
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

                    <div className="mt-auto">
                        <button className="flex items-center text-white font-bold hover:bg-firstColor p-2 w-full rounded-lg transition-colors duration-300">
                            <FaSignOutAlt size={20} />
                            {isOpen && <span className="ml-2">Salir</span>}
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;