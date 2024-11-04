import React from 'react';

const ModalUserInfo = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    &times;
                </button>

                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg">
                        <img
                            src="/images/usericon.png"
                            alt="User profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mt-4">Antonio Gonzales</h3>
                    <p className="text-xs text-gray-500">BOLIVIA</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 font-medium">Nombre</p>
                        <p className="text-gray-800 font-semibold">Antonio Gonzales</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Fecha de Nacimiento</p>
                        <p className="text-gray-800 font-semibold">28/08/1996</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Edad</p>
                        <p className="text-gray-800 font-semibold">25</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Numero de celular</p>
                        <p className="text-gray-800 font-semibold">+591 2387428345</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Email</p>
                        <p className="text-gray-800 font-semibold">antonio.gonzales@gmail.com</p>
                    </div>
                    
                </div>

                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-sixthColor text-white rounded-lg hover:bg-firstColor transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalUserInfo;
