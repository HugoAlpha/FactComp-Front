"use client";
import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import Sidebar from "@/components/commons/sidebar";
import Header from "@/components/commons/header";
import CreateEditClientModal from "@/components/layouts/modalCreateEditClient";
import { PATH_URL_BACKEND } from "@/utils/constants";

const Dashboard = () => {
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [recentClients, setRecentClients] = useState([]);

    const handleOpenClientModal = () => {
        setSelectedClient(null);
        setIsClientModalOpen(true);
    };

    const handleCloseClientModal = () => {
        setIsClientModalOpen(false);
    };

    const handleSaveClient = (newClient) => {
        console.log("Cliente guardado:", newClient);
        handleCloseClientModal();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/factura`);
                if (response.ok) {
                    const data = await response.json();

                    // Ordenamos las facturas por fecha de emisión en orden descendente
                    const sortedData = data.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision));
                    const lastFourInvoices = sortedData.slice(0, 4);

                    // Mapeamos los últimos 4 registros de facturas
                    const formattedInvoices = lastFourInvoices.map(invoice => ({
                        id: invoice.id,
                        status: invoice.estado === "VALIDA" ? "Fac. Válida" : "Anulada",
                        statusColor: invoice.estado === "VALIDA" ? "green" : "red",
                        method: invoice.codigoMetodoPago === 1 ? "Efectivo" : invoice.codigoMetodoPago === 2 ? "Tarjeta" : "Transferencia",
                        amount: `$${invoice.montoTotal.toFixed(2)}`,
                        date: new Date(invoice.fechaEmision).toLocaleDateString(),
                        company: invoice.razonSocialEmisor,
                    }));

                    const formattedClients = lastFourInvoices.map(invoice => ({
                        id: invoice.id,
                        name: invoice.nombreRazonSocial ? invoice.nombreRazonSocial : "Sin Nombre",
                        amount: `$${invoice.montoTotal.toFixed(2)}`,
                        location: `${invoice.numeroDocumento}`,
                    }));

                    setRecentInvoices(formattedInvoices);
                    setRecentClients(formattedClients);
                } else {
                    console.error("Error al obtener los datos de las facturas");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
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
                            <div className="col-span-2 flex flex-col min-h-full">
                                <div className="relative bg-white shadow-sm border border-slate-200 rounded-lg flex-grow">
                                    <div className="p-4 flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-slate-800">Facturas Recientes</h4>
                                        <a href="bill" className="font-medium text-blue-600 hover:underline">
                                            See All Invoices
                                        </a>
                                    </div>
                                    <p className="text-sm text-slate-500 px-4">Puedes ver el estado de las Facturas</p>
                                    <div className="overflow-x-auto px-4">
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
                            <div className="flex flex-col min-h-full">
                                <div className="relative bg-white shadow-sm border border-slate-200 rounded-lg flex-grow">
                                    <div className="p-4 flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-slate-800">Clientes Recientes</h4>
                                        <a href="clientList" className="font-medium text-blue-600 hover:underline">
                                            See All Customers
                                        </a>
                                    </div>
                                    <p className="text-sm text-slate-500 px-4">Resumen de clientes</p>
                                    <div className="overflow-x-auto px-4">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <tbody>
                                                {recentClients.map((client) => (
                                                    <tr className="bg-white border-b hover:bg-gray-50" key={client.id}>
                                                        <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                            <img className="w-10 h-10 rounded-full" src={`https://i.pravatar.cc/40?u=${client.name}`} alt={client.name} />
                                                            <div className="ps-3">
                                                                <div className="text-base font-semibold">{client.name}</div>
                                                                <div className="font-normal text-gray-500">{client.location}</div>
                                                            </div>
                                                        </th>
                                                        <td className="px-6 py-4 text-right">{client.amount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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
                                            onClick={handleOpenClientModal}
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

            {/* Modal para crear o editar cliente */}
            <CreateEditClientModal
                isOpen={isClientModalOpen}
                onClose={handleCloseClientModal}
                customer={selectedClient || { id: 0, nombreRazonSocial: '', numeroDocumento: '', complemento: '', codigoTipoDocumentoIdentidad: 0, codigoCliente: '', email: '' }}
                onSave={handleSaveClient}
            />
        </div>
    );
};

export default Dashboard;
