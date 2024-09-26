import { useState } from 'react';
import Image from 'next/image';
import { FaFileInvoice, FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaHome, FaUsers, FaBuilding } from 'react-icons/fa';
import { MdOutlinePointOfSale } from "react-icons/md";

const Sidebar = () => {
    const [openMenus, setOpenMenus] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleMenu = (menuName) => {
        setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const menuItems = [
        {
            name: 'Documentos',
            icon: <FaFileInvoice />,
            subItems: [
                { name: 'Factura', href: 'bill' },
                { name: 'Nota DC', href: '#' }
            ]
        },
        {
            name: 'Gestion POS',
            icon: <FaUser />,
            subItems: [
                { name: 'Clientes', href: 'clientList' },
                { name: 'Productos', href: 'products' }
            ]
        },
        {
            name: 'Puntos',
            icon: <FaFileInvoice />,
            subItems: [
                { name: 'Puntos de venta', href: 'puntoVenta' },
                { name: 'Sucursales', href: 'branches' }
            ]
        },
        {
            name: 'Certificación',
            icon: <FaFileInvoice />,
            subItems: [
                { name: 'Submenú 1', href: '#' },
                { name: 'Submenú 2', href: '#' }
            ]
        },
        {
            name: 'Parámetros',
            icon: <FaFileInvoice />,
            subItems: [
                { name: 'Submenú 1', href: '#' },
                { name: 'Submenú 2', href: '#' }
            ]
        },
        {
            name: 'Configuracion SIAT',
            icon: <FaFileInvoice />,
            subItems: [
                { name: 'Actividades', href: 'activities' },
                { name: 'Leyendas', href: '#' }
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

            <aside className={`bg-gray-800 text-white min-h-screen fixed md:relative z-10 transition-all duration-300
                ${isSidebarOpen ? 'w-64' : 'w-0 md:w-64'}`}>
                <div className="p-4 flex flex-col h-full">
                    <div className="mb-6">
                        <Image
                            src="/images/LogoIdAlpha.png"
                            alt="Logo"
                            width={250}
                            height={150}
                            className="mx-auto"
                        />
                    </div>
                    <nav className="flex-grow">
                        <ul className="space-y-2">
                            <li>
                                <a href="dashboard" className="block p-2 hover:bg-gray-700 rounded-lg">
                                    <span className="flex items-center">
                                        <FaHome className="mr-2" /> Inicio
                                    </span>
                                </a>
                            </li>

                            <li>
                                <a href="sales" className="block p-2 hover:bg-gray-700 rounded-lg">
                                    <span className="flex items-center">
                                        <MdOutlinePointOfSale className="mr-2" /> Nueva Venta
                                    </span>
                                </a>
                            </li>

                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-700 rounded-lg"
                                    >
                                        <span className="flex items-center">
                                            {item.icon}
                                            <span className="ml-2">{item.name}</span>
                                        </span>
                                        <FaChevronDown className={`transition-transform duration-200 ${openMenus[item.name] ? 'transform rotate-180' : ''}`} />
                                    </button>
                                    {openMenus[item.name] && (
                                        <ul className="ml-4 mt-2 space-y-2">
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li key={subIndex}>
                                                    <a href={subItem.href} className="block p-2 pl-4 hover:bg-gray-700 rounded-lg">
                                                        {subItem.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}

                            <li>
                                <a href="/users" className="block p-2 hover:bg-gray-700 rounded-lg">
                                    <span className="flex items-center">
                                        <FaUsers className="mr-2" /> Usuarios
                                    </span>
                                </a>
                            </li>

                            <li>
                                <a href="/enterprise" className="block p-2 hover:bg-gray-700 rounded-lg">
                                    <span className="flex items-center">
                                        <FaBuilding className="mr-2" /> Empresa
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="mt-auto">
                        <button className="flex items-center text-white hover:bg-gray-700 p-2 rounded-lg w-full">
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
