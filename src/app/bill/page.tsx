"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaEye, FaTimes, FaAngleRight, FaAngleLeft } from 'react-icons/fa';
import { HiReceiptRefund } from "react-icons/hi2";
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { PATH_URL_BACKEND } from '@/utils/constants';
import Swal from 'sweetalert2';
import ModalContingencyPackage from "@/components/layouts/modalContingencyPackage"
import CashierSidebar from '@/components/commons/cashierSidebar';
import ModalContingency from '@/components/layouts/modalContingency';
import { TbCircleCheckFilled } from "react-icons/tb";
import { IoQrCode } from "react-icons/io5";
import Footer from '@/components/commons/footer';
import { BsClipboardCheck } from 'react-icons/bs';
import jsQR from 'jsqr';


interface FormattedBill {
  id: string;
  documentNumber: string;
  client: string;
  date: string;
  total: string;
  estado: string;
  codigoSucursal: number;
  codigoPuntoVenta: number;
  cuf: string;
  formato: string;
}

const BillList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<FormattedBill | null>(null);
  const [bills, setBills] = useState<FormattedBill[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [estadoFilter, setEstadoFilter] = useState('TODAS');
  const [motivosAnulacion, setMotivosAnulacion] = useState([]);
  const [fechaDesde, setFechaDesde] = useState<string | null>(null);
  const [fechaHasta, setFechaHasta] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContingencyModalOpen, setIsContingencyModalOpen] = useState(false);
  const [isContingencyMode, setIsContingencyMode] = useState(false);
  const [contingencyState, setContingencyState] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchBills = async () => {
    try {
      const estadoParam = isContingencyMode ? 'OFFLINE' : (estadoFilter === 'TODAS' ? '' : (estadoFilter === 'VALIDA' ? '1' : '0'));
      const endpoint = estadoParam ? `${PATH_URL_BACKEND}/factura/estado?estado=${estadoParam}` : `${PATH_URL_BACKEND}/factura`;

      const response = await fetch(endpoint);

      if (response.ok) {
        const data = await response.json();
        const idPOS = parseInt(localStorage.getItem('idPOS') || '0');
        const codigoPOS = parseInt(localStorage.getItem('CodigoPOS') || '0');
        const filteredData = data.filter((bill) =>
          bill.codigoPuntoVenta === codigoPOS && bill.puntoVenta && bill.puntoVenta.id === idPOS
        );


        const formattedData = filteredData.map((bill) => ({
          documentNumber: bill.numeroDocumento,
          numeroFactura: bill.numeroFactura,
          client: bill.nombreRazonSocial,
          date: new Date(bill.fechaEmision),
          total: bill.montoTotal.toFixed(2),
          estado: bill.estado || '-',
          codigoSucursal: bill.codigoSucursal,
          codigoPuntoVenta: bill.codigoPuntoVenta,
          cuf: bill.cuf,
          puntoVenta: bill.puntoVenta,
          id: bill.id,
          formato: bill.formato
        }));


        const sortedData = formattedData.sort((a, b) => b.date - a.date);
        setBills(sortedData);

      } else {
        console.error('Error fetching bills');
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };


  useEffect(() => {
    fetchBills();
  }, [isContingencyMode, estadoFilter]);

  useEffect(() => {
    const handleContingencyChange = () => {
      const contingenciaEstado = localStorage.getItem('contingenciaEstado');
      setIsContingencyMode(contingenciaEstado === '1');
    };

    window.addEventListener('contingencyStateChange', handleContingencyChange);

    return () => {
      window.removeEventListener('contingencyStateChange', handleContingencyChange);
    };
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

  const handleViewQR = async (cuf, numeroFactura) => {
    try {
      const response = await fetch(`${PATH_URL_BACKEND}/images/view?cuf=${cuf}&numeroFactura=${numeroFactura}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext('2d');
          context.drawImage(img, 0, 0);

          const imageData = context.getImageData(0, 0, img.width, img.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

          if (qrCode) {
            window.open(qrCode.data, '_blank');
          } else {
            Swal.fire('Error', 'No se pudo leer el código QR.', 'error');
          }
        };
      } else {
        Swal.fire('Error', 'No se pudo obtener el código QR.', 'error');
      }
    } catch (error) {
      console.error('Error fetching QR:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar obtener el código QR.', 'error');
    }
  };


  useEffect(() => {
    fetchBills();
    const timer = setTimeout(() => {
        checkServerCommunication();
    }, 8000);
    return () => clearTimeout(timer);
}, [estadoFilter]);

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    const contingenciaEstado = localStorage.getItem('contingenciaEstado');
    if (contingenciaEstado === '1') {
      setIsContingencyMode(true);
    } else {
      setIsContingencyMode(false);
    }
  }, []);


  const closeModal2 = () => setIsContingencyModalOpen(false);

  const fetchBillDetails = async (id: string) => {
    try {
      const response = await fetch(`${PATH_URL_BACKEND}/factura/${id}`);
      if (response.ok) {
        const data = await response.json();
        return {
          cuf: data.cuf,
          numeroFactura: data.numeroFactura,
        };
      } else {
        Swal.fire('Error', 'No se pudo obtener los detalles de la factura.', 'error');
        return null;
      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar obtener los detalles de la factura.', 'error');
      return null;
    }
  };

  const fetchMotivosAnulacion = async () => {
    try {
      const response = await fetch(`${PATH_URL_BACKEND}/parametro/motivo-anulacion`);
      if (response.ok) {
        const data = await response.json();
        setMotivosAnulacion(data);
      } else {
        console.error('Error fetching motivos de anulación');
      }
    } catch (error) {
      console.error('Error fetching motivos de anulación:', error);
    }
  };

  useEffect(() => {
    fetchMotivosAnulacion();
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const handleViewRollo = async (id: string) => {
    const billDetails = await fetchBillDetails(id);

    if (billDetails) {
      const { cuf, numeroFactura } = billDetails;
      const response = await fetch(`${PATH_URL_BACKEND}/pdf/download/rollo?cuf=${cuf}&numeroFactura=${numeroFactura}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const printWindow = window.open(url);
        printWindow?.focus();
      } else {
        Swal.fire('Error', 'No se pudo obtener la factura en formato rollo.', 'error');
      }
    }
  };

  const filteredBills = useMemo(() => {
    if (typeof window !== "undefined") {
      const contingenciaEstado = localStorage.getItem('contingenciaEstado');

      return bills.filter((bill) => {
        const matchesSearch =
          bill.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.client.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesEstado =
          estadoFilter === 'TODAS' ||
          (estadoFilter === 'VALIDA' && bill.estado.toUpperCase() === 'VALIDA') ||
          (estadoFilter === 'ANULADO' && bill.estado.toUpperCase() === 'ANULADO');

        const matchesFecha =
          (!fechaDesde || new Date(bill.date) >= new Date(fechaDesde)) &&
          (!fechaHasta || new Date(bill.date) <= new Date(fechaHasta));

        if (contingenciaEstado === '1') {
          return bill.estado.toUpperCase() === 'OFFLINE' && matchesSearch && matchesFecha;
        }

        return matchesSearch && matchesEstado && matchesFecha;
      });
    }
    return [];
  }, [bills, searchQuery, estadoFilter, fechaDesde, fechaHasta]);



  const totalPages = Math.ceil(filteredBills.length / rowsPerPage);

  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginated = filteredBills.slice(startIndex, startIndex + rowsPerPage);
    return paginated;
  }, [filteredBills, currentPage, rowsPerPage]);


  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatus = (estado: string) => {
    switch (estado) {
      case 'ONLINE':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-600">Online</span>;
      case 'OFFLINE':
        return <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600">Offline</span>;
      case 'ANULADO':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-600">Anulado</span>;
      case 'RECHAZADA':
        return <span className="px-2 py-1 rounded-full bg-black text-white">Rechazado</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">Desconocido</span>;
    }
  };
  useEffect(() => {
    const handleContingencyChange = () => {
      const contingenciaEstado = localStorage.getItem('contingenciaEstado');
      setIsContingencyMode(contingenciaEstado === '1');
      fetchBills();
    };

    window.addEventListener('contingencyActivated', handleContingencyChange);
    window.addEventListener('contingencyDeactivated', handleContingencyChange);

    return () => {
      window.removeEventListener('contingencyActivated', handleContingencyChange);
      window.removeEventListener('contingencyDeactivated', handleContingencyChange);
    };
  }, []);


  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pageNumbers = [];
    const maxVisiblePages = 4;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleAnularFactura = async (bill: any) => {

    if (bill.estado === 'ANULADO') {
      Swal.fire('Información', 'Esta factura ya fue anulada.', 'info');
      return;
    }

    if (!bill.cuf) {
      Swal.fire('Error', 'No se encontró el CUF de la factura', 'error');
      return;
    }

    const { value: motivo } = await Swal.fire({
      title: 'Selecciona el motivo de anulación',
      input: 'select',
      inputOptions: motivosAnulacion.reduce((options: any, motivo: any) => {
        options[motivo.codigoClasificador] = motivo.descripcion;
        return options;
      }, {}),
      inputPlaceholder: 'Selecciona un motivo',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve(null);
          } else {
            resolve('Debes seleccionar un motivo de anulación');
          }
        });
      }
    });

    if (motivo) {
      try {
        const body = {
          cuf: bill.cuf,
          anulacionMotivo: motivo,
          idPuntoVenta: bill.puntoVenta.id,
          idSucursal: parseInt(localStorage.getItem('idSucursal') as string)
        };

        const response = await fetch(`${PATH_URL_BACKEND}/factura/anular`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          Swal.fire(
            'Anulada!',
            'La factura ha sido anulada correctamente.',
            'success'
          );
          fetchBills(estadoFilter);
        } else {
          Swal.fire(
            'Error!',
            'No se pudo anular la factura.',
            'error'
          );
        }
      } catch (error) {
        console.error('Error al anular factura:', error);
        Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
      }
    }
  };

  const handleRevertAnulation = async (bill: any) => {
    if (!bill.cuf) {
      Swal.fire('Error', 'No se encontró el CUF de la factura', 'error');
      return;
    }
  
    try {
      const body = {
        cuf: bill.cuf,
        idPuntoVenta: bill.puntoVenta.id,
        idSucursal: parseInt(localStorage.getItem('idSucursal') as string),
      };
  
      const response = await fetch(`${PATH_URL_BACKEND}/factura/reversion-anular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        Swal.fire(
          'Reversión Exitosa!',
          'La anulación de la factura ha sido revertida correctamente.',
          'success'
        );
        fetchBills(estadoFilter);
      } else {
        Swal.fire(
          'Error!',
          'No se pudo revertir la anulación de la factura.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error al revertir la anulación:', error);
      Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
    }
  };
  

  const handleSendContingencyPackages = () => {
    Swal.fire({
        title: '¿Está seguro de enviar los paquetes de contingencia?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Enviando paquetes...',
                html: 'Por favor, espere mientras se envían los paquetes.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const idPuntoVenta = localStorage.getItem('idPOS');
            const idSucursal = localStorage.getItem('idSucursal');
            const idEvento = localStorage.getItem('idEvento');

            if (!idPuntoVenta || !idSucursal || !idEvento) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Faltan datos para enviar los paquetes de contingencia. Por favor, asegúrese de que todos los datos estén disponibles.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            try {
                const response = await fetch(`${PATH_URL_BACKEND}/factura/emitir-paquete/${idPuntoVenta}/${idSucursal}/${idEvento}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    const deactivationEvent = new CustomEvent('contingencyDeactivated');
                    window.dispatchEvent(deactivationEvent);
                    setIsContingencyMode(false);
                    fetchBills();

                    localStorage.removeItem('contingenciaEstado');
                    localStorage.removeItem('horaActivacionContingencia');
                    localStorage.removeItem('fechaHoraContingencia');
                    localStorage.removeItem('idEvento');

                    Swal.fire({
                        title: 'Paquetes enviados',
                        text: 'El modo contingencia se ha desactivado, puede volver a emitir facturas.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                } else {
                    throw new Error('No se pudo enviar los paquetes de contingencia.');
                }
            } catch (error) {
                console.error('Error al enviar paquetes de contingencia:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al intentar enviar los paquetes de contingencia.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }
    });
};

  return (
    <div className="flex min-h-screen">
      {userRole === 'ROLE_ADMIN' ? <Sidebar /> : <CashierSidebar />}
      <div className="flex flex-col w-full min-h-screen">
        <Header />
        <div className="flex-grow overflow-auto bg-gray-50 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0 text-gray-700">Lista de Facturas</h1>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Buscar por número de factura o cliente"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg w-full md:w-1/4 h-10 px-3"
            />

            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="border border-gray-300 rounded-lg w-full md:w-auto h-10 px-3"
            >
              <option value="TODAS">Todas</option>
              <option value="VALIDA">Válido</option>
              <option value="ANULADO">Anulado</option>
            </select>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <div className="flex items-center">
                <label htmlFor="fechaDesde" className="text-sm font-medium text-gray-700 mr-2">Fecha desde:</label>
                <input
                  id="fechaDesde"
                  type="date"
                  value={fechaDesde || ''}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="border border-gray-300 rounded-lg w-full md:w-auto h-10 px-3"
                />
              </div>

              <div className="flex items-center">
                <label htmlFor="fechaHasta" className="text-sm font-medium text-gray-700 mr-2">Fecha hasta:</label>
                <input
                  id="fechaHasta"
                  type="date"
                  value={fechaHasta || ''}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="border border-gray-300 rounded-lg w-full md:w-auto h-10 px-3"
                />
              </div>
                <button
                  className="bg-firstColor text-white rounded-lg font-bold hover:bg-fourthColor p-1 md:p-2"
                  onClick={handleSendContingencyPackages}
                >
                  Enviar paquetes contingencia
                </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <div className={`${selectedBill ? 'w-full md:w-2/3' : 'w-full'} transition-all duration-300`}>
              <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-fourthColor text-left text-gray-700">
                      <th className="px-4 py-2 md:px-6 md:py-4 font-bold">ID de factura</th>
                      <th className="px-4 py-2 md:px-6 md:py-4 font-bold">Cliente</th>
                      <th className="px-4 py-2 md:px-6 md:py-4 font-bold">Fecha</th>
                      <th className="px-4 py-2 md:px-6 md:py-4 font-bold">Total</th>
                      <th className="px-4 py-2 md:px-6 md:py-4 font-bold">Estado</th>
                      <th className="px-4 py-2 md:px-6 md:py-4 font-bold">Formato</th>
                      <th className="px-4 py-2 md:px-6 md:py-4 font-bold">Operaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBills.map((bill) => (
                      <tr key={bill.id} className="border-b hover:bg-gray-50 text-black">
                        <td className="px-4 py-2 md:px-6 md:py-4">{bill.id}</td>
                        <td className="px-4 py-2 md:px-6 md:py-4">{bill.client}</td>
                        <td className="px-4 py-2 md:px-6 md:py-4">
                          {bill.date.toLocaleDateString()} {bill.date.toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4">{bill.total}</td>
                        <td className="px-4 py-2 md:px-6 md:py-4">{getStatus(bill.estado)}</td>
                        <td className="px-4 py-2 md:px-6 md:py-4">
                          {bill.formato === 'VALIDA' ? (
                            <TbCircleCheckFilled className="text-2xl md:text-5xl text-green-600" />
                          ) : (
                            <FaTimes className="text-2xl md:text-5xl text-red-600" />
                          )}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4">
                          <div className="flex space-x-2">
                            <button
                              className="bg-green-200 hover:bg-green-300 p-1 md:p-2 rounded-l-lg flex items-center justify-center border border-green-300 relative group"
                              onClick={() => handleViewRollo(bill.id)}
                            >
                              <FaEye className="text-sm md:text-lg text-black" />
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                                Ver rollo
                            </span>
                            </button>

                            <button
                              className="bg-yellow-200 hover:bg-yellow-300 p-1 md:p-2 flex items-center justify-center border border-yellow-300 relative group"
                              onClick={() => handleViewQR(bill.cuf, bill.numeroFactura)}
                            >
                              <BsClipboardCheck className="text-sm md:text-lg text-black" />
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                                Ver en SIAT
                            </span>
                            </button>

                            {bill.estado === 'ANULADO' ? (
                              <button
                                className="bg-blue-200 hover:bg-blue-300 p-1 md:p-2 rounded-r-lg flex items-center justify-center border border-blue-300 relative group"
                                onClick={() => handleRevertAnulation(bill)}
                              >
                                <HiReceiptRefund className="text-sm md:text-lg text-black" />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                                  Revertir Anulación
                                </span>
                              </button>
                            ) : (
                              <button
                                className="bg-red-200 hover:bg-red-300 p-1 md:p-2 rounded-r-lg flex items-center justify-center border border-red-300 relative group"
                                onClick={() => handleAnularFactura(bill)}
                              >
                                <HiReceiptRefund className="text-sm md:text-lg text-black" />
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-xs rounded px-2 py-1">
                                  Anular
                                </span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-center mt-6">
                <div className="flex justify-center space-x-1 mb-2">
                  <button
                    onClick={handleFirstPage}
                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    Primero
                  </button>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    Ant.
                  </button>
                  {getPageNumbers(currentPage, totalPages).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    Sig.
                  </button>
                  <button
                    onClick={handleLastPage}
                    className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    Último
                  </button>
                </div>
                <div className="flex space-x-1 justify-center mt-2 mr-2">
                  <span className="text-sm font-normal text-gray-500">
                    Mostrando página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isContingencyModalOpen && (
          <ModalContingency isOpen={isContingencyModalOpen} onClose={closeModal2} />
        )}
        <Footer />
      </div>
    </div>
  );
};

export default BillList;