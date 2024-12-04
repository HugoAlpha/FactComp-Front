import { PATH_URL_BACKEND } from '@/utils/constants';
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ModalContingencyHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContingencyHistory = ({ isOpen, onClose }: ModalContingencyHistoryProps) => {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch(`${PATH_URL_BACKEND}/contingencia/lista-evento-significativo`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(err => console.error('Error fetching data:', err));
    }
  }, [isOpen]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const filteredData = data.filter((row) => {
    const rowStartDate = new Date(row.fechaInicio);

    // Filtrado por descripción + ID + fecha de inicio
    const matchesDescription = row.descripcion.toLowerCase().includes(filter.toLowerCase()) || String(row.id).includes(filter);

    // Filtrado por la fecha de inicio
    const matchesStartDate = !startDate || rowStartDate >= startDate;

    return matchesDescription && matchesStartDate;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 h-auto max-h-[95%] w-full max-w-4xl overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Historial de Contingencia</h2>
        </div>

        <div className="flex flex-col md:flex-row items-center md:justify-between mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
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
              placeholder="Buscar por descripción, ID..."
              className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm text-sm placeholder-gray-400 h-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex mb-4">
          <div>
            <label className="block text-sm font-medium">Fecha de Inicio</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              className="border p-2 rounded-lg w-full"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccionar fecha de inicio"
            />
          </div>
        </div>

        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="table-auto w-full bg-white">
            <thead>
              <tr className="bg-fourthColor text-left text-gray-700">
                <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">ID Evento</th>
                <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">Descripción</th>
                <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">Fecha Inicio</th>
                <th className="px-4 md:px-6 py-2 md:py-4 font-bold text-xs md:text-base">Fecha Fin</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 text-black">
                  <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{row.id}</td>
                  <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{row.descripcion}</td>
                  <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{formatDate(row.fechaInicio)}</td>
                  <td className="px-4 md:px-6 py-2 md:py-4 text-xs md:text-base">{formatDate(row.fechaFin)}</td>
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
                className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
            Mostrando página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
          </span>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 font-semibold"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalContingencyHistory;
