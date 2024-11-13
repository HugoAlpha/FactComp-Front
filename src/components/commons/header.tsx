import React, { useEffect, useState, useRef } from 'react';
import { FaUser, FaCog } from 'react-icons/fa';
import { IoExitOutline } from 'react-icons/io5';
import ModalContingency from '../layouts/modalContingency';
import { PATH_URL_BACKEND } from '@/utils/constants';
import ModalUserInfo from '@/components/layouts/modalUserInfo';
import Swal from 'sweetalert2';


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
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    const userMenuRef = useRef(null);
    const settingsMenuRef = useRef(null);
    const [isOnline, setIsOnline] = useState(true);
    const [userName, setuserName] = useState(0);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);



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

    useEffect(() => {

        const nameUser = localStorage.getItem('username');
        setuserName(nameUser);
        if (isOnline) {
            checkContingencyState();
        }
    }, [isOnline]);

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

        const event = new CustomEvent('contingencyDeactivated');
        window.dispatchEvent(event);
    };

    useEffect(() => {
        loadContingencyState();
        window.addEventListener('storage', (e) => {
            if (e.key && ['contingenciaEstado', 'horaActivacionContingencia', 'fechaHoraContingencia'].includes(e.key)) {
                loadContingencyState();
            }
        });
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

    const handleLogout = () => {
        Swal.fire({
            title: '¿Deseas cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            customClass: {
                confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: "center",
                    icon: 'success',
                    text: 'Hasta Pronto!!',
                    showConfirmButton: false,
                    timer: 3000,
                });
                localStorage.clear();
                window.location.href = "/";

            }
        });
    };

    const handleContingenciaChange = () => {
        if (!contingencia) {
            setShowModal(true);
        } else {
            Swal.fire({
                title: '¿Deseas salir del modo de contingencia?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    desactivarContingencia();
                }
            });
        }
    };

    const desactivarContingencia = async () => {
        const idEvento = localStorage.getItem('idEvento');
        if (!idEvento) {
            console.error('No se encontró idEvento en el localStorage');
            return;
        }
    
        Swal.fire({
            title: 'Desactivando modo contingencia...',
            html: 'Por favor, espere mientras se completa la operación.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/registrar-fin-evento/${idEvento}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Contingencia desactivada:', data.mensaje);
                clearContingencyState();
                syncContingencyState();
    
                Swal.fire({
                    icon: 'success',
                    title: 'Modo contingencia desactivado',
                    text: 'El modo de contingencia ha sido desactivado exitosamente.',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                throw new Error('Error al registrar el fin del evento de contingencia');
            }
        } catch (error) {
            console.error('Error al desactivar contingencia:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo desactivar el modo de contingencia. Intente nuevamente.',
            });
        }
    };
    

    const confirmarContingencia = (eventoDescripcion) => {
        const ahora = new Date();
        const timestamp = ahora.getTime();
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
        checkContingencyState();

        const event = new CustomEvent('contingencyActivated');
        window.dispatchEvent(event);
    };

    useEffect(() => {
        const handleContingencyActivated = () => {
            setIsOnline(false);
            setContingencia(true);
            updateColors(true);
        };

        const handleContingencyDeactivated = () => {
            setIsOnline(true);
            setContingencia(false);
            updateColors(false);
        };

        window.addEventListener('contingencyActivated', handleContingencyActivated);
        window.addEventListener('contingencyDeactivated', handleContingencyDeactivated);

        return () => {
            window.removeEventListener('contingencyActivated', handleContingencyActivated);
            window.removeEventListener('contingencyDeactivated', handleContingencyDeactivated);
        };
    }, []);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleUserMenuToggle = () => {
        setShowUserMenu((prev) => !prev);
        if (showSettingsMenu) setShowSettingsMenu(false);

    };
    const handleUserMenuToggle2 = () => {
        setIsUserModalOpen(!isUserModalOpen);
    };

    const handleSettingsMenuToggle = () => {
        setShowSettingsMenu((prev) => !prev);
        if (showUserMenu) setShowUserMenu(false);
    };


    const handleOutsideClick = (event) => {
        if (
            userMenuRef.current && !userMenuRef.current.contains(event.target) &&
            settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)
        ) {
            setShowUserMenu(false);
            setShowSettingsMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const checkContingencyState = () => {
        const storedContingencyState = localStorage.getItem('contingenciaEstado');
        return storedContingencyState === '1';
    };

    const checkServerCommunication = async () => {
        if (checkContingencyState()) {
            setIsOnline(false);
            return;
        }

        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/verificar-comunicacion`);
            if (response.ok) {
                setIsOnline(true);
            } else if (response.status === 500) {
                setIsOnline(false);
            }
        } catch (error) {
            console.error("Error al verificar comunicación:", error);
            setIsOnline(false);
        }
    };

    useEffect(() => {
        checkServerCommunication();
        const intervalId = setInterval(checkServerCommunication, 1000000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center shadow-md p-4 bg-seventhColor">
            <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4 sm:space-x-6">
                    <div className="relative text-center sm:text-left">
                        <span className="text-base sm:text-lg font-semibold text-principalColor whitespace-nowrap">
                            Sistema de Facturación Computarizada en Línea
                        </span>
                    </div>
                    <div className="flex items-center bg-fourthColor px-2 sm:px-3 py-1 rounded-lg space-x-2">
                        <span className="text-xs sm:text-sm font-medium text-black">
                            {isOnline ? "Online" : "Offline"}
                        </span>
                        <span className="relative flex h-3 w-3">
                            <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"
                                    } opacity-75`}
                            ></span>
                            <span
                                className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? "bg-green-500" : "bg-red-500"
                                    }`}
                            ></span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-4 sm:space-x-6 mt-4 sm:mt-0">
                    <label className="inline-flex items-center cursor-pointer">
                        <span className="text-xs sm:text-sm font-medium text-gray-800 mr-2">
                            Modo Contingencia
                        </span>
                        <input
                            type="checkbox"
                            checked={contingencia}
                            onChange={handleContingenciaChange}
                            className="sr-only peer"
                        />
                        <div
                            className={`relative w-10 sm:w-12 h-5 sm:h-6 rounded-full transition-colors duration-300 ${contingencia ? "bg-green-500" : "bg-gray-400"
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 left-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${contingencia ? "transform translate-x-5 sm:translate-x-6" : "transform translate-x-0"
                                    }`}
                            ></div>
                        </div>
                    </label>

                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={handleUserMenuToggle}
                            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition duration-200"
                        >
                            <FaUser className="text-principalColor text-lg sm:text-xl" />
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg z-50 divide-y divide-gray-100">
                                <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                                    <div>Usuario:</div>
                                    <div className="font-bold truncate uppercase">{userName}</div>
                                </div>
                                <ul className="py-2 text-xs sm:text-sm text-gray-700">
                                    <li>
                                        <button onClick={() => setIsUserModalOpen(true)} className="w-full px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
                                            Configuración
                                        </button>
                                        {isUserModalOpen && (
                                            <ModalUserInfo isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
                                        )}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition duration-200"
                    >
                        <IoExitOutline className="text-principalColor w-5 sm:w-6 h-5 sm:h-6" />
                    </button>
                </div>
            </div>

            {showModal && (
                <ModalContingency
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={confirmarContingencia}
                />
            )}

            {contingencia && countdown > 0 && (
                <div className="absolute top-16 right-4 z-30 text-gray-200 p-2 rounded-md bg-black/50">
                    Tiempo restante: {formatTime(countdown)}
                </div>
            )}
        </header>
    );

};

export default Header;
