"use client";
import { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import { MdPointOfSale } from "react-icons/md";
import CashierSidebar from "@/components/commons/cashierSidebar";
import Header from "@/components/commons/header";
import CreateEditClientModal from "@/components/layouts/modalCreateEditClient";
import { PATH_URL_BACKEND } from "@/utils/constants";
import Swal from "sweetalert2";
import ModalContingency from '@/components/layouts/modalContingency';
import Footer from "@/components/commons/footer";

const DashboardCashier = () => {
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [recentClients, setRecentClients] = useState([]);


    const [dailySales, setDailySales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 }).format(value);
    };

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

    const handleConfirm = (eventoDescripcion: string) => {
        console.log("Evento confirmado:", eventoDescripcion);
        setIsContingencyModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idPuntoVenta = localStorage.getItem('idPOS');
                const idSucursal = localStorage.getItem('idSucursal');
                const fechaActual = new Date().toISOString().split('T')[0];

                const dailySalesResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/ventas-diarias-monto`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idPuntoVenta: parseInt(idPuntoVenta, 10),
                        idSucursal: 1,
                        fecha: fechaActual,
                    }),
                });
                const dailySalesData = await dailySalesResponse.json();
                setDailySales(dailySalesData || 0);

                const primerDiaMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                const ultimoDiaMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

                const monthlySalesResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/ventas-mensuales-montos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idPuntoVenta: parseInt(idPuntoVenta, 10),
                        idSucursal: 1,
                        fechaInicio: primerDiaMes,
                        fechaFin: ultimoDiaMes,
                    }),
                });
                const monthlySalesData = await monthlySalesResponse.json();
                setMonthlySales(monthlySalesData || 0);

                const idBranch = localStorage.getItem('idSucursal');
                const idPOS = localStorage.getItem('idPOS');
                const totalOrdersResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/ventas-cantidad/${idPOS}/1`);
                const totalOrdersData = await totalOrdersResponse.json();
                setTotalOrders(totalOrdersData || 0);

                const totalClientsResponse = await fetch(`${PATH_URL_BACKEND}/dashboard/clientes-registrados`);
                const totalClientsData = await totalClientsResponse.json();
                setTotalClients(totalClientsData || 0);

                const response = await fetch(`${PATH_URL_BACKEND}/factura`);
                if (response.ok) {
                    const data = await response.json();
                    const filteredData = data.filter(invoice => invoice.codigoPuntoVenta === Number(idPOS));
                    const sortedData = filteredData.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision));
                    const lastFourInvoices = sortedData.slice(0, 4);
                    const formattedInvoices = lastFourInvoices.map(invoice => ({
                        id: invoice.id,
                        status: invoice.estado === "VALIDA" ? "Fac. Válida" : "Anulada",
                        statusColor: invoice.estado === "VALIDA" ? "green" : "red",
                        method: invoice.codigoMetodoPago === 1 ? "Efectivo" : invoice.codigoMetodoPago === 7 ? "Transferencia" : "Otro",
                        amount: `Bs ${invoice.montoTotal.toFixed(2)}`,
                        date: new Date(invoice.fechaEmision).toLocaleDateString(),
                        company: invoice.razonSocialEmisor,
                    }));
                    setRecentInvoices(formattedInvoices);
                } else {
                    console.error("Error al obtener los datos de las facturas");
                }

                const clientsResponse = await fetch(`${PATH_URL_BACKEND}/api/clientes/`);
                if (clientsResponse.ok) {
                    const clientsData = await clientsResponse.json();
                    const sortedClients = clientsData.sort((a, b) => b.id - a.id).slice(0, 4);
                    const documentTypes = {
                        1: "CI",
                        2: "CEX",
                        5: "NIT",
                        3: "PAS",
                        4: "OD"
                    };

                    const formattedClients = sortedClients.map(client => ({
                        id: client.id,
                        name: client.nombreRazonSocial,
                        document: `${documentTypes[client.codigoTipoDocumentoIdentidad] || 'Documento Desconocido'} - ${client.numeroDocumento}`,
                        code: client.codigoCliente || "Sin Código"
                    }));
                    setRecentClients(formattedClients);
                } else {
                    console.error("Error al obtener los datos de los clientes");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor", error);
            }
        };

        fetchData();
    }, []);

    const checkServerCommunication = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/verificar-comunicacion`);
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
                            setIsContingencyModalOpen(true);
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
                    setIsContingencyModalOpen(true);
                } else {
                    console.log('Modo de contingencia cancelado.');
                }
            });
        }
    };

    useEffect(() => {
        checkServerCommunication();
    }, []);

    const closeModal = () => {
        setIsContingencyModalOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <CashierSidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50 mt-8">
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
                            {/* Ventas de Hoy */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Ventas de Hoy</h3>
                                <p className="text-lg sm:text-xl font-bold text-slate-800">{dailySales ? formatCurrency(dailySales) : 'Cargando...'}</p>
                            </div>

                            {/* Total Mensual */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Total Mensual</h3>
                                <p className="text-lg sm:text-xl font-bold text-slate-800">{monthlySales ? formatCurrency(monthlySales) : 'Cargando...'}</p>
                            </div>

                            {/* Total de Facturas */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Total de Facturas</h3>
                                <p className="text-lg sm:text-xl font-bold text-slate-800">{totalOrders ? totalOrders : 'Cargando...'}</p>
                            </div>

                            {/* Clientes Registrados */}
                            <div className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-4">
                                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Clientes</h3>
                                <p className="text-lg sm:text-xl font-bold text-slate-800">{totalClients ? totalClients : 'Cargando...'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="col-span-1 lg:col-span-2 flex flex-col min-h-full">
                                <div className="relative bg-white shadow-sm border border-slate-200 rounded-lg flex-grow">
                                    <div className="p-4 flex justify-between items-center">
                                        <h4 className="text-sm sm:text-base font-semibold text-slate-800">Facturas Recientes</h4>
                                        <a href="bill" className="font-bold text-firstColor hover:underline">
                                            Ver todas las facturas
                                        </a>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-500 px-4">Puedes ver el estado de las Facturas</p>
                                    <div className="overflow-x-auto px-4">
                                        <table className="w-full text-xs sm:text-sm text-left text-gray-500">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-2">Estado</th>
                                                    <th scope="col" className="px-4 py-2">Método</th>
                                                    <th scope="col" className="px-4 py-2">Monto</th>
                                                    <th scope="col" className="px-4 py-2">Fecha</th>
                                                    <th scope="col" className="px-4 py-2">Compañía</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentInvoices.map((invoice) => (
                                                    <tr className="bg-white border-b" key={invoice.id}>
                                                        <td className="px-4 py-2 flex items-center space-x-1">
                                                            <FaCircle className={`text-${invoice.statusColor}-500`} />
                                                            <span>{invoice.status}</span>
                                                        </td>
                                                        <td className="px-4 py-2">{invoice.method}</td>
                                                        <td className="px-4 py-2">{invoice.amount}</td>
                                                        <td className="px-4 py-2">{invoice.date}</td>
                                                        <td className="px-4 py-2">{invoice.company}</td>
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
                                        <h4 className="text-sm sm:text-base font-semibold text-slate-800">Clientes Recientes</h4>
                                        <a href="clientList" className="font-bold text-firstColor hover:underline">
                                            Ver todos los clientes
                                        </a>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-500 px-4">Resumen de clientes</p>
                                    <div className="overflow-x-auto px-4">
                                        <table className="w-full text-xs sm:text-sm text-left text-gray-500">
                                            <tbody>
                                                {recentClients.map((client) => (
                                                    <tr className="bg-white border-b hover:bg-gray-50" key={client.id}>
                                                        <th scope="row" className="flex items-center px-4 py-2 whitespace-nowrap">
                                                            <img className="w-8 sm:w-10 h-8 sm:h-10 rounded-full" src={`https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png`} alt={client.name} />
                                                            <div className="pl-2">
                                                                <div className="text-xs sm:text-sm font-semibold">{client.name}</div>
                                                                <div className="text-xs font-normal text-gray-500">{client.document}</div>
                                                            </div>
                                                        </th>
                                                        <td className="px-4 py-2 text-right">{client.code}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <section className="bg-white mt-6">
                            <div className="px-4 mx-auto max-w-screen-xl sm:py-8 lg:px-6">
                                <div className="mx-auto max-w-screen-sm text-center">
                                    <h2 className="text-xl sm:text-3xl tracking-tight font-extrabold text-gray-900">
                                        Realiza una nueva acción
                                    </h2>
                                    <p className="mb-4 sm:mb-6 font-light text-gray-500 text-sm sm:text-base">
                                        Inicia una nueva venta o agrega un cliente nuevo para continuar con tus operaciones.
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                                        {/* Botón para nueva venta */}
                                        <a
                                            href="/sales"
                                            className="flex items-center justify-center text-white bg-firstColor hover:bg-fourthColor focus:ring-4 focus:ring-primary-300 font-bold rounded-lg text-sm px-4 sm:px-5 py-2.5"
                                        >
                                            <MdPointOfSale className="text-lg sm:text-xl mr-2" />
                                            <span>Iniciar nueva venta</span>
                                        </a>
                                        {/* Botón para nuevo cliente */}
                                        <a
                                            href="#"
                                            onClick={handleOpenClientModal}
                                            className="flex items-center justify-center text-white bg-thirdColor hover:bg-fourthColor focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-sm px-4 sm:px-5 py-2.5"
                                        >
                                            <IoMdPersonAdd className="text-lg sm:text-xl mr-2" />
                                            <span>Agregar un nuevo cliente</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <Footer />
            </div>

            <CreateEditClientModal
                isOpen={isClientModalOpen}
                onClose={handleCloseClientModal}
                customer={selectedClient || { id: 0, nombreRazonSocial: '', numeroDocumento: '', complemento: '', codigoTipoDocumentoIdentidad: 0, codigoCliente: '', email: '' }}
                onSave={handleSaveClient}
            />
            <ModalContingency
                isOpen={isContingencyModalOpen}
                onClose={closeModal}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default DashboardCashier;
