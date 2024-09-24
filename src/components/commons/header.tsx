import React from 'react';
import { FaUser, FaCog } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="flex justify-between items-center bg-white shadow p-4">
            {/* Mensaje de bienvenida */}
            <div>
                <h1 className="text-lg text-gray-700">Welcome!</h1>
            </div>

            {/* Iconos de configuración y usuario */}
            <div className="flex items-center space-x-4">
                {/* Icono de configuración */}
                <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                    <FaCog className="text-purple-700 text-xl" />
                </button>

                {/* Icono de usuario */}
                <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                    <FaUser className="text-black text-xl" />
                </button>
            </div>
        </header>
    );
};

export default Header;
