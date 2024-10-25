import React from 'react';
import { FaCashRegister } from "react-icons/fa6";
import HeaderPOS from '@/components/commons/headerPOS';

const KanbanView = () => {
    const today = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });


    const salesPoints = [
        'Punto de venta 1',
        'Punto de venta 2',
        'Punto de venta 3',
        'Punto de venta 4',
        'Punto de venta 5',
        'Punto de venta 6',
        'Punto de venta 7',
        'Punto de venta 8',
        'Punto de venta 9',
        'Punto de venta 10',
        
    ];

    return (
      <div className="min-h-screen flex flex-col">
      <HeaderPOS />
      
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {salesPoints.map((point, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow p-6">

                      <FaCashRegister className="w-7 h-7 text-gray-500 mb-3" />
                       
                        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                            {point}
                        </h5>
                        <p className="mb-3 font-normal text-gray-500">
                            Sucursal Miraflores<br />{today}
                        </p>
                        <a
                            href="/dashboardCashier"
                            className="inline-flex font-medium items-center text-blue-600 hover:underline"
                        >
                            Ingrear a punto de venta
                            <svg
                                className="w-3 h-3 ms-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
                                />
                            </svg>
                        </a>
                    </div>
                ))}
            </div>
            <footer className="mt-auto text-center text-gray-500 py-4 border-t border-gray-200">
                ALPHA SYSTEMS S.R.L. EBILL 2.0 2024 Derechos Reservados
            </footer>
        </div>
       </div>
    );
};

export default KanbanView;
