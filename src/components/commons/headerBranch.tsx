"use client";
import React from 'react';
import { IoExitOutline } from 'react-icons/io5';

const HeaderBranch = () => {
    const limpiarLocal = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <header className="flex justify-between items-center shadow p-4 bg-ninthColor">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center flex-grow">
                    <div className="relative mx-2 lg:mx-0">
                        <span className="text-2xl font-bold text-principalColor">
                            Bienvenido/a, por favor elige la sucursal a gestionar
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={limpiarLocal}
                        className="flex items-center bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                    >
                        <IoExitOutline className="text-principalColor text-xl" />
                        <span className="ml-2 text-sm font-medium text-principalColor">Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default HeaderBranch;
