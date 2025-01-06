"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/commons/sidebar";
import Header from "@/components/commons/header";
import CashierSidebar from "@/components/commons/cashierSidebar";
import { PATH_URL_BACKEND } from '@/utils/constants';

const SynchronizationHistory = () => {
  const [data, setData] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userRole, setUserRole] = useState<string | null>("ROLE_ADMIN");
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${PATH_URL_BACKEND}/sincronizar-diario/all`);
        const result = await response.json();
        const sortedData = result.sort((a: any, b: any) => b.id - a.id);
        setData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  const getStatus = (status: boolean) => {
    if (status) {
      return <span className="px-2 py-1 rounded-full bg-green-100 text-green-600">Exitoso</span>;
    }
    return <span className="px-2 py-1 rounded-full bg-black text-white">Fallido</span>;
  };
  

  const filteredData = data.filter((row) => {
    const statusText = row.status ? "Exitoso" : "Fallido"; 
    return Object.values(row)
      .some((value) => value.toString().toLowerCase().includes(filter.toLowerCase())) || 
      statusText.includes(filter.toLowerCase());
  });
  

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {userRole === "ROLE_ADMIN" ? <Sidebar /> : <CashierSidebar />}
      <div className="flex flex-col w-full min-h-screen">
        <Header />
        <div className="flex-grow overflow-auto bg-gray-50 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-700">
            Historial de Sincronización
          </h2>
          <div className="flex flex-col md:flex-row items-center md:justify-between mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <label htmlFor="itemsPerPage" className="mr-2 text-sm">
                Elementos por página:
              </label>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border p-2 rounded-lg w-20 h-10 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="relative flex items-center w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Buscar por tipo de registro..."
                className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm text-sm placeholder-gray-400 h-10"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="table-auto w-full bg-white">
              <thead>
                <tr className="bg-fourthColor text-left text-gray-700">
                  <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">
                    Fecha
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">
                    Estado
                  </th>
                  <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 text-black"
                  >
                    <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">
                      {row.date}
                    </td>
                    <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">
                      {getStatus(row.status)}
                    </td>
                    <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">
                      {row.type}
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
                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
              >
                Primero
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
              >
                Ant.
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${
                    page === currentPage
                      ? "bg-slate-800 text-white"
                      : "text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
              >
                Sig.
              </button>
              <button
                onClick={handleLastPage}
                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
              >
                Último
              </button>
            </div>
            <span className="text-sm font-normal text-gray-500">
              Mostrando página{" "}
              <span className="font-semibold text-gray-900">{currentPage}</span>{" "}
              de{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynchronizationHistory;
