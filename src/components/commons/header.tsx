import React, { useEffect, useState } from 'react';
import { FaUser, FaCog } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import ModalContingency from '../layouts/modalContingency';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [contingencia, setContingencia] = useState(false);
    const [countdown, setCountdown] = useState(0);

    function calculateTimeLeft(activationTime) {
        const now = new Date().getTime();
        const twoHours = 2 * 60 * 60 * 1000;
        return Math.max(0, activationTime + twoHours - now);
    }

    useEffect(() => {
        if (typeof window !== 'undefined') { 
            const storedContingencia = localStorage.getItem('contingenciaEstado');
            const storedTime = localStorage.getItem('horaActivacionContingencia');

            if (storedContingencia && storedTime) {
                const timeLeft = calculateTimeLeft(parseInt(storedTime));
                
                if (timeLeft > 0) {
                    setContingencia(storedContingencia === '1');
                    setCountdown(timeLeft);
                    console.log('Contingencia restaurada:', {
                        estado: storedContingencia === '1',
                        tiempoRestante: timeLeft,
                        horaActivacion: new Date(parseInt(storedTime)).toLocaleString()
                    });
                } else {
                    localStorage.removeItem('contingenciaEstado');
                    localStorage.removeItem('horaActivacionContingencia');
                    console.log('Contingencia expirada');
                }
            }
        }
    }, []);


    useEffect(() => {
        let timer;
        if (countdown > 0 && contingencia) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    const newCount = prev - 1000;
                    if (newCount <= 0) {
                        localStorage.removeItem('contingenciaEstado');
                        localStorage.removeItem('horaActivacionContingencia');
                        setContingencia(false);
                        console.log('Contingencia finalizada por tiempo');
                        return 0;
                    }
                    return newCount;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown, contingencia]);

    const limpiarLocal = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const handleContingenciaChange = () => {
        if (!contingencia) {
            setShowModal(true);
        } else {
            desactivarContingencia();
        }
    };

    const desactivarContingencia = () => {
        localStorage.setItem('contingenciaEstado', '0');
        localStorage.removeItem('horaActivacionContingencia');
        setContingencia(false);
        setCountdown(0);
        console.log('Contingencia desactivada');
    };

    const confirmarContingencia = (eventoDescripcion) => {
        const horaActual = new Date().getTime();
        localStorage.setItem('contingenciaEstado', '1');
        localStorage.setItem('horaActivacionContingencia', horaActual.toString());

        setContingencia(true);
        setCountdown(2 * 60 * 60 * 1000);

        console.log('Contingencia activada:', {
            estado: true,
            evento: eventoDescripcion,
            horaActivacion: new Date(horaActual).toLocaleString(),
            tiempoTotal: '2 horas'
        });

        setShowModal(false);
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <header className={`flex justify-between items-center bg-white shadow p-4 ${contingencia ? 'bg-red-100' : ''}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center flex-grow">
                    <div className="relative mx-2 lg:mx-0">
                        <span className="w-96 rounded-md pl-2 text-2xl font-bold text-principalColor">
                            Bienvenid@
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center me-5 cursor-pointer">
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-black">Modo contingencia</span>
                        <input 
                            type="checkbox" 
                            checked={contingencia}
                            onChange={handleContingenciaChange} 
                            className="sr-only peer" 
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>

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
            
            {showModal && (
                <ModalContingency 
                    onClose={() => setShowModal(false)} 
                    onConfirm={confirmarContingencia} 
                />
            )}

            {contingencia && countdown > 0 && (
                <div className="absolute top-16 right-4 bg-gray-800 text-gray-200 p-2 rounded-md">
                    Tiempo restante: {formatTime(countdown)}
                </div>
            )}
        </header>
    );
};

export default Header;