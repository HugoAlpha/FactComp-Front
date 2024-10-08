"use client"
import Header from "@/components/commons/header"
import Sidebar from "@/components/commons/sidebar"
import { PATH_URL_BACKEND } from "@/utils/constants"
import { useState, useEffect } from "react"
import { FaSearch } from "react-icons/fa"

const Parameters = () => {
    const [metodoPagoData, setMetodoPagoData] = useState([]);
    const [eventoSignificativoData, setEventoSignificativoData] = useState([]);
    const [motivoAnulacionData, setMotivoAnulacionData] = useState([]);
    const [paisOrigenData, setPaisOrigenData] = useState([]);
    const [tiposFacturaData, setTiposFacturaData] = useState([]);
    const [identidadData, setIdentidadData] = useState([]);
    const [documentoSectorData, setDocumentoSectorData] = useState([]);
    const [tipoEmisionData, setTipoEmisionData] = useState([]);
    const [tipoHabitacionData, setTipoHabitacionData] = useState([]);
    const [tipoMonedaData, setTipoMonedaData] = useState([]);
    const [tipoPuntoVentaData, setTipoPuntoVentaData] = useState([]);
    const [unidadMedidaData, setUnidadMedidaData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState("metodoPago");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const getPageNumbers = () => {
        const totalNumbersToShow = 5;
        const halfRange = Math.floor(totalNumbersToShow / 2);

        let startPage = Math.max(1, currentPage - halfRange);
        let endPage = Math.min(totalPages, currentPage + halfRange);

        if (currentPage <= halfRange) {
            endPage = Math.min(totalNumbersToShow, totalPages);
        } else if (currentPage + halfRange >= totalPages) {
            startPage = Math.max(1, totalPages - totalNumbersToShow + 1);
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const fetchMetodoPago = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/metodo-pago`);
            const data = await response.json();
            setMetodoPagoData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching metodo-pago:", error);
        }
    };

    const fetchEventoSignificativo = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/eventos-significativos`);
            const data = await response.json();
            setEventoSignificativoData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching eventos-significativos:", error);
        }
    };

    const fetchMotivoAnulacion = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/motivo-anulacion`);
            const data = await response.json();
            setMotivoAnulacionData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching motivo-anulacion:", error);
        }
    };

    const fetchPaisOrigen = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/pais-origen`);
            const data = await response.json();
            setPaisOrigenData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching pais-origen:", error);
        }
    };

    const fetchTiposFactura = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/tipos-factura`);
            const data = await response.json();
            setTiposFacturaData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching tipos-factura:", error);
        }
    };

    const fetchIdentidad = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/identidad`);
            const data = await response.json();
            setIdentidadData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching identidad:", error);
        }
    };

    const fetchDocumentoSector = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/documento-sector`);
            const data = await response.json();
            setDocumentoSectorData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching documento-sector:", error);
        }
    };

    const fetchTipoEmision = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/tipo-emision`);
            const data = await response.json();
            setTipoEmisionData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching tipo-emision:", error);
        }
    };

    const fetchTipoHabitacion = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/tipo-habitacion`);
            const data = await response.json();
            setTipoHabitacionData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching tipo-habitacion:", error);
        }
    };

    const fetchTipoMoneda = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/tipo-moneda`);
            const data = await response.json();
            setTipoMonedaData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching tipo-moneda:", error);
        }
    };

    const fetchTipoPuntoVenta = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/tipo-punto-venta`);
            const data = await response.json();
            setTipoPuntoVentaData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching tipo-punto-venta:", error);
        }
    };

    const fetchUnidadMedida = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/parametro/unidad-medida`);
            const data = await response.json();
            setUnidadMedidaData(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching unidad-medida:", error);
        }
    };

    useEffect(() => {
        switch (activeTab) {
            case "metodoPago":
                fetchMetodoPago();
                break;
            case "eventoSignificativo":
                fetchEventoSignificativo();
                break;
            case "motivoAnulacion":
                fetchMotivoAnulacion();
                break;
            case "paisOrigen":
                fetchPaisOrigen();
                break;
            case "tiposFactura":
                fetchTiposFactura();
                break;
            case "identidad":
                fetchIdentidad();
                break;
            case "documentoSector":
                fetchDocumentoSector();
                break;
            case "tipoEmision":
                fetchTipoEmision();
                break;
            case "tipoHabitacion":
                fetchTipoHabitacion();
                break;
            case "tipoMoneda":
                fetchTipoMoneda();
                break;
            case "tipoPuntoVenta":
                fetchTipoPuntoVenta();
                break;
            case "unidadMedida":
                fetchUnidadMedida();
                break;
            default:
                break;
        }
    }, [activeTab, itemsPerPage]);

    const getCurrentData = (data) => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        // Filtrar los datos por término de búsqueda antes de paginarlos
        const filteredData = data.filter(item =>
            item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codigoClasificador.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    };



    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h1 className="text-xl font-bold mb-4">Parámetros</h1>
                        <div className="flex items-center mb-4 justify-between">
                            <div>
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    id="itemsPerPage"
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="border px-2 py-1 rounded"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="relative flex items-center w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Buscar por Descripción o Código Clasificador"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm text-sm placeholder-gray-400"
                                />
                                <FaSearch className="absolute right-4 text-gray-500 text-xl pointer-events-none" />
                            </div>


                        </div>
                        <div className="flex mb-6 border-b">
                            {["metodoPago", "eventoSignificativo", "motivoAnulacion", "paisOrigen", "tiposFactura", "identidad", "documentoSector", "tipoEmision", "tipoHabitacion", "tipoMoneda", "tipoPuntoVenta", "unidadMedida"].map((tab) => (
                                <button
                                    key={tab}
                                    className={`mx-3 pb-1 ${activeTab === tab ? "border-b-4 border-firstColor text-firstColor" : "text-gray-500"}`}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setCurrentPage(1);
                                    }}
                                    style={{ transition: "all 0.3s ease" }}
                                >
                                    {tab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </button>
                            ))}
                        </div>


                        <h2 className="text-lg font-semibold mb-2">
                            {activeTab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h2>
                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">

                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">ID</th>
                                        <th className="px-6 py-4 font-bold">Código Clasificador</th>
                                        <th className="px-6 py-4 font-bold">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getCurrentData(eval(`${activeTab}Data`)).map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{item.id}</td>
                                            <td className="px-6 py-4">{item.codigoClasificador}</td>
                                            <td className="px-6 py-4">{item.descripcion}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>


                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Ant.
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'} focus:bg-slate-800 focus:text-white active:border-slate-800 active:bg-slate-800`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Sig.
                            </button>
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Parameters;
