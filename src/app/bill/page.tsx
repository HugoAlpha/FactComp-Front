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

  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const contingenciaEstado = localStorage.getItem('contingenciaEstado');
      setIsContingencyMode(contingenciaEstado === '1');
    }
  }, []);

  const fetchBills = async (estado?: string) => {
    try {
      const estadoParam = estadoFilter === 'TODAS' ? '' : (estadoFilter === 'VALIDA' ? '1' : '0');
      const endpoint = estadoParam ? `${PATH_URL_BACKEND}/factura/estado?estado=${estadoParam}` : `${PATH_URL_BACKEND}/factura`;

      const response = await fetch(endpoint);

      if (response.ok) {
        const data = await response.json();

        const formattedData = data.map((bill: any) => ({
          documentNumber: bill.numeroDocumento,
          client: bill.nombreRazonSocial,
          date: new Date(bill.fechaEmision),
          total: bill.montoTotal.toFixed(2),
          estado: bill.estado || '-',
          codigoSucursal: bill.codigoSucursal,
          codigoPuntoVenta: bill.codigoPuntoVenta,
          cuf: bill.cuf,
          puntoVenta: bill.puntoVenta,
          id: bill.id,
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
              setIsContingencyModalOpen(true);
            } else {
              console.log('Modo de contingencia cancelado.');
            }
          });
        } else {
          console.error("Error de comunicación con el servidor:", response.statusText);
        }
      } else {
        fetchBills();
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
    fetchBills();
    checkServerCommunication();
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
    console.log("User Role:", role); 
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
    return filteredBills.slice(startIndex, startIndex + rowsPerPage);
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
    if (estado === 'ANULADO') {
      return (
        <span className="px-2 py-1 rounded-full bg-red-100 text-red-600">Anulado</span>
      );
    } else if (estado === 'VALIDA') {
      return (
        <span className="px-2 py-1 rounded-full bg-green-100 text-green-600">Válido</span>
      );
    } else if (estado === 'OFFLINE') {
      return (
        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-600">Offline</span>
      );
    }
    else {
      return (
        <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">Desconocida</span>
      );
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
    console.log('Factura seleccionada para anulación:', bill);

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
          idPuntoVenta: bill.puntoVenta.id
        };

        console.log('Body que se enviará al POST:', body);

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
  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);

  const handleSendContingencyPackages = () => {
    Swal.fire({
      title: '¿Está seguro de enviar los paquetes de contingencia?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let timerInterval;
        Swal.fire({
          title: 'Enviando paquetes...',
          html: 'Completando en <b></b> segundos.',
          timer: 5000, 
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const b = Swal.getHtmlContainer().querySelector('b');
            timerInterval = setInterval(() => {
              b.textContent = Math.ceil(Swal.getTimerLeft() / 1000).toString();
            }, 1000);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then(() => {
          localStorage.clear();
          window.location.reload();
        });
      }
    });
  };
  

  return (
    <div className="flex min-h-screen">
      {userRole === 'ROLE_ADMIN' ? <Sidebar /> : <CashierSidebar />}
      <div className="flex flex-col w-full min-h-screen">
        <Header />
        <div className="flex-grow overflow-auto bg-gray-50 p-6">
          <div className='flex justify-between'>
            <h1 className="text-2xl font-bold mb-6 text-gray-700">Lista de Facturas</h1>

          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 w-full">
              <input
                type="text"
                placeholder="Buscar por número de factura o cliente"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg w-1/4 h-10 px-3"
              />

              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="border border-gray-300 rounded-lg  h-10 px-3"
              >
                <option value="TODAS">Todas</option>
                <option value="VALIDA">Válido</option>
                <option value="ANULADO">Anulado</option>
              </select>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <label htmlFor="fechaDesde" className="text-sm font-medium text-gray-700 place-content-center mr-2">Fecha desde:</label>
                  <input
                    id="fechaDesde"
                    type="date"
                    value={fechaDesde || ''}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="border border-gray-300 rounded-lg h-10 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label htmlFor="fechaHasta" className="text-sm font-medium text-gray-700 place-content-center mr-2">Fecha hasta:</label>
                  <input
                    id="fechaHasta"
                    type="date"
                    value={fechaHasta || ''}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="border border-gray-300 rounded-lg  h-10 px-3"
                  />
                </div>
                
                {isContingencyMode && (
                  <button
                    className="bg-firstColor text-white rounded-lg font-bold hover:bg-fourthColor  h-10 px-3"
                    onClick={handleSendContingencyPackages}
                  >
                    Enviar paquetes contingencia
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-6">
            <div className={`${selectedBill ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
              <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 bg-white">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="bg-fourthColor text-left text-gray-700">
                      <th className="px-6 py-4 font-bold">Número de Documento</th>
                      <th className="px-6 py-4 font-bold">Cliente</th>
                      <th className="px-6 py-4 font-bold">Fecha</th>
                      <th className="px-6 py-4 font-bold">Total</th>
                      <th className="px-6 py-4 font-bold">Formato</th>
                      <th className="px-6 py-4 font-bold">Comprobado</th>
                      <th className="px-6 py-4 font-bold">Operaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBills.map((bill) => (
                      <tr key={bill.id} className="border-b hover:bg-gray-50 text-black">
                        <td className="px-6 py-4">{bill.documentNumber}</td>
                        <td className="px-6 py-4">{bill.client}</td>
                        <td className="px-6 py-4">
                          {bill.date.toLocaleDateString()} {bill.date.toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4">{bill.total}</td>
                        <td className="px-6 py-4">{getStatus(bill.estado)}</td>
                        <td className="px-6 py-4">
                          <TbCircleCheckFilled
                            className='text-5xl text-green-600' />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex">
                            <button
                              className="bg-green-200 hover:bg-green-300 p-2 rounded-l-lg flex items-center justify-center border border-green-300"
                              onClick={() => handleViewRollo(bill.id)}
                            >
                              <FaEye className="text-black" />
                            </button>
                            <button
                              className="bg-blue-200 hover:bg-blue-300 p-2 rounded-r-lg flex items-center justify-center border border-blue-300"
                              onClick={() => handleAnularFactura(bill)}
                            >
                              <HiReceiptRefund className="text-black" />
                            </button>
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
                        className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'} focus:bg-slate-800 focus:text-white active:border-slate-800 active:bg-slate-800`}
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
                    <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
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
      </div>
    </div>
  );
};

export default BillList;

