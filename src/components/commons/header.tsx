import React from 'react';
import { FaUser, FaCog } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';

const Header = () => {
    const limpiarLocal = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <header className="flex justify-between items-center bg-white shadow p-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center flex-grow">
                    <div className="relative mx-2 lg:mx-0">
                        <span className="w-96 rounded-md pl-2 text-2xl font-bold text-principalColor">
                            Bienvenid@
                        </span>
                    </div>
                </div>
                

                <div className="flex items-center space-x-4">
                    <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                        <FaCog className="text-principalColor text-xl" />
                    </button>

                    <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                        <FaUser className="text-principalColor text-xl" />
                    </button>

                    <button onClick={limpiarLocal} className="flex items-center bg-gray-100 rounded-full p-1 text-principalColor">
                            <IoExitOutline className="w-7 h-7 pl-1" />
                        </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
