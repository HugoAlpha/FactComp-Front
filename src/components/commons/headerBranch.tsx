"use client";
import React, { useEffect, useState } from 'react';
import { IoExitOutline } from 'react-icons/io5';
import { PATH_URL_BACKEND } from '@/utils/constants';

const HeaderBranch = () => {
    const [empresa, setEmpresa] = useState<string | null>(null);

    useEffect(() => {
        const idEmpresa = localStorage.getItem("idEmpresa");
        
        if (idEmpresa) {
            fetch(`${PATH_URL_BACKEND}/empresa/${idEmpresa}`)
                .then((response) => response.json())
                .then((data) => {
                    setEmpresa(data.razonSocial);
                })
                .catch((error) => console.error("Error fetching empresa data:", error));
        }
    }, []);

    const limpiarLocal = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <header className="flex items-center shadow p-4 bg-ninthColor">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex-shrink-0">
                    <span className="text-2xl font-bold text-principalColor mr-24">
                        Bienvenido/a, por favor elige la sucursal a gestionar
                    </span>
                    <span className="text-2xl font-bold text-principalColor ml-44">
                        {empresa}
                    </span>
                </div>
                <div className="flex items-center">
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
