"use client";
import { FaCircle } from "react-icons/fa";
import { useState } from "react";
import Sidebar from "@/components/commons/sidebar";
import Header from "@/components/commons/header";

const Dashboard = () => {
    const recentInvoices = [
        {
            id: 1,
            status: "Fac. Válida",
            method: "Visa card ****4831",
            amount: "$182.94",
            date: "Jan 17, 2022",
            company: "Amazon",
            statusColor: "green",
        },
        {
            id: 2,
            status: "Fac. Válida",
            method: "Mastercard ****6442",
            amount: "$99.00",
            date: "Jan 17, 2022",
            company: "Facebook",
            statusColor: "green",
        },
        {
            id: 3,
            status: "Pendiente",
            method: "Account ****882",
            amount: "$249.94",
            date: "Jan 17, 2022",
            company: "Netflix",
            statusColor: "yellow",
        },
        {
            id: 4,
            status: "Anulada",
            method: "Amex ****5666",
            amount: "$199.24",
            date: "Jan 17, 2022",
            company: "Amazon Prime",
            statusColor: "red",
        },
    ];

    const recentClients = [
        { id: 1, name: "Jenny Wilson", amount: "$11,234", location: "Austin", email: "w.lawson@example.com" },
        { id: 2, name: "Devon Lane", amount: "$11,159", location: "New York", email: "dat.roberts@example.com" },
        { id: 3, name: "Jane Cooper", amount: "$10,483", location: "Toledo", email: "jgraham@example.com" },
        { id: 4, name: "Dianne Russell", amount: "$9,084", location: "Naperville", email: "curtis.d@example.com" },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Contenido principal */}
            <div className="flex flex-col w-full min-h-screen">
                {/* Header */}
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        {/* Cards de estadísticas */}
                        <div className="grid grid-cols-4 gap-6 mb-6">
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Ventas de Hoy</h3>
                                <p className="text-2xl font-bold text-slate-800">$12,426</p>
                                <span className="text-green-500 text-sm">+36%</span>
                            </div>

                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Total Mensual</h3>
                                <p className="text-2xl font-bold text-slate-800">$2,38,485</p>
                                <span className="text-red-500 text-sm">-14%</span>
                            </div>

                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Total Ordenes</h3>
                                <p className="text-2xl font-bold text-slate-800">84,382</p>
                                <span className="text-green-500 text-sm">+36%</span>
                            </div>

                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Clientes</h3>
                                <p className="text-2xl font-bold text-slate-800">33,493</p>
                                <span className="text-green-500 text-sm">+36%</span>
                            </div>
                        </div>

                        {/* Facturas Recientes */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <div className="relative overflow-x-auto bg-white shadow-sm border border-slate-200 rounded-lg">
                                    <div className="p-4">
                                        <h4 className="text-lg font-semibold text-slate-800">Facturas Recientes</h4>
                                        <a href="#" className="font-medium text-blue-600 hover:underline">
                                            See All Customers
                                        </a>
                                        <p className="text-sm text-slate-500">Puedes ver el estado de las Facturas</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">Estado</th>
                                                    <th scope="col" className="px-6 py-3">Método</th>
                                                    <th scope="col" className="px-6 py-3">Monto</th>
                                                    <th scope="col" className="px-6 py-3">Fecha</th>
                                                    <th scope="col" className="px-6 py-3">Compañía</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentInvoices.map((invoice) => (
                                                    <tr className="bg-white border-b" key={invoice.id}>
                                                        <td className="px-6 py-4 flex items-center space-x-2">
                                                            <FaCircle className={`text-${invoice.statusColor}-500`} />
                                                            <span>{invoice.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4">{invoice.method}</td>
                                                        <td className="px-6 py-4">{invoice.amount}</td>
                                                        <td className="px-6 py-4">{invoice.date}</td>
                                                        <td className="px-6 py-4">{invoice.company}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>


                            {/* Clientes Recientes */}
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-slate-800">Clientes Recientes</h4>
                                    <p className="text-sm text-slate-500">Resumen de clientes</p>
                                </div>
                                <table className="w-full text-sm text-left text-gray-500">
                                    <tbody>
                                        <tr className="bg-white border-b hover:bg-gray-50">
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                {/* los https://i.pravatar.cc/40 son para profile images de prueba, no quitar hasta tener los endpoint plox*/}
                                                <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/40?u=JennyWilson" alt="Jenny Wilson" />
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Jenny Wilson</div>
                                                    <div className="font-normal text-gray-500">w.lawson@example.com</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 text-right">$11,234</td>
                                            <td className="px-6 py-4 text-right">Austin</td>
                                        </tr>
                                        <tr className="bg-white border-b hover:bg-gray-50">
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/40?u=DevonLane" alt="Devon Lane" />
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Devon Lane</div>
                                                    <div className="font-normal text-gray-500">dat.roberts@example.com</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 text-right">$11,159</td>
                                            <td className="px-6 py-4 text-right">New York</td>
                                        </tr>
                                        <tr className="bg-white border-b hover:bg-gray-50">
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/40?u=JaneCooper" alt="Jane Cooper" />
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Jane Cooper</div>
                                                    <div className="font-normal text-gray-500">jgraham@example.com</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 text-right">$10,483</td>
                                            <td className="px-6 py-4 text-right">Toledo</td>
                                        </tr>
                                        <tr className="bg-white hover:bg-gray-50">
                                            <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/40?u=DianneRussell" alt="Dianne Russell" />
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Dianne Russell</div>
                                                    <div className="font-normal text-gray-500">curtis.d@example.com</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 text-right">$9,084</td>
                                            <td className="px-6 py-4 text-right">Naperville</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="p-4">
                                    <a href="#" className="font-medium text-blue-600 hover:underline">
                                        See All Customers
                                    </a>
                                </div>
                            </div>
                        </div>
                        <section className="bg-white mt-8">
                            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                                <div className="mx-auto max-w-screen-sm text-center">
                                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900">
                                        Realiza una nueva acción
                                    </h2>
                                    <p className="mb-6 font-light text-gray-500 md:text-lg">
                                        Inicia una nueva venta o agrega un cliente nuevo para continuar con tus operaciones.
                                    </p>
                                    <div className="flex justify-center space-x-4">
                                        {/* Botón para nueva venta */}
                                        <a
                                            href="/sales"
                                            className="text-white bg-firstColor hover:bg-fourthColor focus:ring-4 focus:ring-primary-300 font-bold rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-[#2C3E50] focus:outline-none dark:focus:ring-primary-800"
                                        >
                                            Iniciar una nueva Venta
                                        </a>
                                        {/* Botón para nuevo cliente */}
                                        <a
                                            href="#"
                                            className="text-white bg-thirdColor hover:bg-fourthColor focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-sm px-5 py-2.5 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none dark:focus:ring-green-800"
                                        >
                                            Agregar un Nuevo Cliente
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
