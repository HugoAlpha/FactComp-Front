"use client";
import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import Sidebar from "@/components/commons/sidebar";
import Header from "@/components/commons/header";
import CreateEditClientModal from "@/components/layouts/modalCreateEditClient";
import { PATH_URL_BACKEND } from "@/utils/constants";
import Swal from "sweetalert2";

const Dashboard = () => {
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [recentClients, setRecentClients] = useState([]);


    const [dailySales, setDailySales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalClients, setTotalClients] = useState(0);

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
                const dailySalesResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/ventas-diarias-monto?fecha=2024-10-03`);
                const dailySalesData = await dailySalesResponse.json();
                console.log("Respuesta completa de ventas diarias:", dailySalesData);
                setDailySales(dailySalesData || 0);

                const monthlySalesResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/ventas-mensuales-montos?fechaInicio=2024-10-01&fechaFin=2024-10-03`);
                const monthlySalesData = await monthlySalesResponse.json();
                console.log("Respuesta completa de ventas mensuales:", monthlySalesData);
                setMonthlySales(monthlySalesData || 0);

                const totalOrdersResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/ventas-cantidad/1`);
                const totalOrdersData = await totalOrdersResponse.json();
                console.log("Respuesta completa de total de órdenes:", totalOrdersData);
                setTotalOrders(totalOrdersData || 0);

                const totalClientsResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/clientes-registrados`);
                const totalClientsData = await totalClientsResponse.json();
                console.log("Respuesta completa de clientes registrados:", totalClientsData);
                setTotalClients(totalClientsData || 0);

                const response = await fetch(`${PATH_URL_BACKEND}/factura`);
                if (response.ok) {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision));
                    const lastFourInvoices = sortedData.slice(0, 4);
                    const formattedInvoices = lastFourInvoices.map(invoice => ({
                        id: invoice.id,
                        status: invoice.estado === "VALIDA" ? "Fac. Válida" : "Anulada",
                        statusColor: invoice.estado === "VALIDA" ? "green" : "red",
                        method: invoice.codigoMetodoPago === 1 ? "Efectivo" : invoice.codigoMetodoPago === 2 ? "Tarjeta" : "Transferencia",
                        amount: `Bs ${invoice.montoTotal.toFixed(2)}`,
                        date: new Date(invoice.fechaEmision).toLocaleDateString(),
                        company: invoice.razonSocialEmisor,
                    }));

                    const formattedClients = lastFourInvoices.map(invoice => ({
                        id: invoice.id,
                        name: invoice.nombreRazonSocial ? invoice.nombreRazonSocial : "Sin Nombre",
                        amount: `Bs ${invoice.montoTotal.toFixed(2)}`,
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

    const checkServerCommunication = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/codigos/cuis/activo/1`);
            if (!response.ok) {
                if (response.status === 500) {
                    Swal.fire({
                        title: 'La comunicación con impuestos falló',
                        text: '¿Desea entrar en modo de contingencia?',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                            cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log('Modo de contingencia aceptado.');
                        } else {
                            console.log('Modo de contingencia cancelado.');
                        }
                    });
                } else {
                    console.error("Error de comunicación con el servidor:", response.statusText);
                }
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire({
                title: 'La comunicación con impuestos falló',
                text: '¿Desea entrar en modo de contingencia?',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                    cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Modo de contingencia aceptado.');
                } else {
                    console.log('Modo de contingencia cancelado.');
                }
            });
        }
    };

    useEffect(() => {
        checkServerCommunication();
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <div className="grid grid-cols-4 gap-6 mb-6">
                            {/* Ventas de Hoy */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Ventas de Hoy</h3>
                                <p className="text-2xl font-bold text-slate-800">Bs {dailySales ? dailySales.toFixed(2) : 'Cargando...'}</p>
                            </div>

                            {/* Total Mensual */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Total Mensual</h3>
                                <p className="text-2xl font-bold text-slate-800">Bs {monthlySales ? monthlySales.toFixed(2) : 'Cargando...'}</p>
                            </div>

                            {/* Total de Facturas */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Total de Facturas</h3>
                                <p className="text-2xl font-bold text-slate-800">{totalOrders ? totalOrders : 'Cargando...'}</p>
                            </div>

                            {/* Clientes Registrados */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800">Clientes</h3>
                                <p className="text-2xl font-bold text-slate-800">{totalClients ? totalClients : 'Cargando...'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 flex flex-col min-h-full">
                                <div className="relative bg-white shadow-sm border border-slate-200 rounded-lg flex-grow">
                                    <div className="p-4 flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-slate-800">Facturas Recientes</h4>
                                        <a href="bill" className="font-bold text-firstColor hover:underline">
                                            Ver todas las facturas
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
                                        <a href="clientList" className="font-bold text-firstColor hover:underline">
                                            Ver todos los clientes
                                        </a>
                                    </div>
                                    <p className="text-sm text-slate-500 px-4">Resumen de clientes</p>
                                    <div className="overflow-x-auto px-4">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <tbody>
                                                {recentClients.map((client) => (
                                                    <tr className="bg-white border-b hover:bg-gray-50" key={client.id}>
                                                        <th scope="row" className="flex items-center px-6 py-4 whitespace-nowrap">
                                                            <img className="w-10 h-10 rounded-full" src={`https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png`} alt={client.name} />
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
