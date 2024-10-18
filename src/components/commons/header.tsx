import React, { useEffect, useState } from 'react';
import { FaUser, FaCog } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import ModalContingency from '../layouts/modalContingency';

const normalColors = {
    principalColor: "#10314b",
    firstColor: "#5086A8",
    secondColor: "#F1F1F1",
    thirdColor: "#75C4D2",
    fourthColor: "#9CBFCF",
    fifthColor: "#D8E3E8",
    sixthColor: "#8C9CBC",
    seventhColor: "#bfccdc",
    eighthColor: "#d8e3e8",
    ninthColor: "#e8f3f5"
};

const contingencyColors = {
    principalColor: "#254f54",
    firstColor: "#346f76",
    secondColor: "#3b7e86",
    thirdColor: "#4a9ea8",
    fourthColor: "#a2bbbe",
    fifthColor: "#92c5cb",
    sixthColor: "#b7d8dc",
    seventhColor: "#c9e2e5",
    eighthColor: "#dbecee",
    ninthColor: "#edf5f6"
};
const CONTINGENCY_EVENT = 'contingencyStateChange';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [contingencia, setContingencia] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const updateColors = (isContingency) => {
        const colors = isContingency ? contingencyColors : normalColors;
        Object.entries(colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--${key}`, value);
        });
    };

    function calculateTimeLeft(activationTime) {
        if (!activationTime) return 0;
        const now = new Date().getTime();
        const twoHours = 2 * 60 * 60 * 1000;
        return Math.max(0, parseInt(activationTime) + twoHours - now);
    }

    const syncContingencyState = () => {
        const event = new CustomEvent(CONTINGENCY_EVENT);
        window.dispatchEvent(event);
    };

    const loadContingencyState = () => {
            const storedContingencia = localStorage.getItem('contingenciaEstado');
            const storedTime = localStorage.getItem('horaActivacionContingencia');
            const storedFormattedTime = localStorage.getItem('fechaHoraContingencia');
            
            if (storedFormattedTime) {
                console.log('Fecha y hora de activación:', storedFormattedTime);
            }
    
            if (storedContingencia === '1' && storedTime) {
                const timeLeft = calculateTimeLeft(storedTime);
                if (timeLeft > 0) {
                    setContingencia(true);
                    setCountdown(timeLeft);
                    updateColors(true);
                    console.log('Estado de contingencia: Activado');
                } else {
                    clearContingencyState();
                }
            } else {
                setContingencia(false);
                updateColors(false);
                console.log('Estado de contingencia: Desactivado');
            }
        };                    
        const clearContingencyState = () => {
            localStorage.removeItem('contingenciaEstado');
            localStorage.removeItem('horaActivacionContingencia');
            localStorage.removeItem('fechaHoraContingencia');
            setContingencia(false);
            setCountdown(0);
            updateColors(false);
            console.log('Estado de contingencia: Desactivado');
            syncContingencyState();
        };
    
        useEffect(() => {
            loadContingencyState();
    
            // Escuchar cambios en localStorage de otras pestañas
            window.addEventListener('storage', (e) => {
                if (e.key && ['contingenciaEstado', 'horaActivacionContingencia', 'fechaHoraContingencia'].includes(e.key)) {
                    loadContingencyState();
                }
            });
    
            // Escuchar el evento personalizado para sincronización
            window.addEventListener(CONTINGENCY_EVENT, loadContingencyState);
    
            return () => {
                window.removeEventListener(CONTINGENCY_EVENT, loadContingencyState);
            };
        }, []);

    useEffect(() => {
        let timer;
        if (countdown > 0 && contingencia) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    const newCount = prev - 1000;
                    if (newCount <= 0) {
                        clearContingencyState();
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
        updateColors(false);  
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
        clearContingencyState();
        syncContingencyState();
    };

    const confirmarContingencia = (eventoDescripcion) => {
        const ahora = new Date();
        const timestamp = ahora.getTime();

        // Formatear la fecha y hora
        const fechaHoraFormateada = ahora.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        localStorage.setItem('contingenciaEstado', '1');
        localStorage.setItem('horaActivacionContingencia', timestamp.toString());
        localStorage.setItem('fechaHoraContingencia', fechaHoraFormateada);

        console.log('Activando contingencia:', {
            fechaHora: fechaHoraFormateada,
            timestamp: timestamp,
            descripcion: eventoDescripcion
        });

        setContingencia(true);
        setCountdown(2 * 60 * 60 * 1000);
        updateColors(true);
        setShowModal(false);
        syncContingencyState();
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <header className={`flex justify-between items-center shadow p-4 bg-ninthColor`}>
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
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thirdColor"></div>
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