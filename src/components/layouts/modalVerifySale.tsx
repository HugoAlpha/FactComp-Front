import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaMoneyBill, FaCreditCard, FaQrcode } from 'react-icons/fa';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  discount?: number;
}

interface ModalVerifySaleProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  total: number;
  onSuccess: (data: { client: string; total: number; numeroFactura: number }) => void;
}

interface Client {
  id: number;
  nombreRazonSocial: string;
  numeroDocumento: string;
  codigoCliente: string;
}

const ModalVerifySale: React.FC<ModalVerifySaleProps> = ({
  isOpen,
  onClose,
  products,
  total,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [changeNeeded, setChangeNeeded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchClients = async () => {
        try {
          const response = await fetch(`${PATH_URL_BACKEND}/api/clientes`);
          if (response.ok) {
            const data = await response.json();
            setClients(data);
          } else {
            Swal.fire('Error', 'Error al obtener la lista de clientes', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
      };

      fetchClients();
    }
  }, [isOpen]);

  const handleValidate = async () => {
    if (paymentMethod === 'Efectivo' && Number(paymentAmount) < total) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad pagada es insuficiente.',
      });
      return;
    }

    if (paymentMethod === 'Híbrido') {
      const totalPayment = parseFloat(cashAmount) + parseFloat(cardAmount);
      if (totalPayment !== total) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La suma del efectivo y la tarjeta debe ser igual al total.',
        });
        return;
      }
    }

    try {
      // Mostrar la alerta de carga con temporizador de 5 segundos
      let timerInterval: NodeJS.Timeout;
      Swal.fire({
        title: 'Se está generando la factura',
        html: 'La factura se generará en <b></b> segundos.',
        timer: 10000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer()?.querySelector('b');
          if (b) {
            timerInterval = setInterval(() => {
              b.textContent = Math.ceil(Swal.getTimerLeft()! / 1000).toString();
            }, 1000);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      const body = {
        usuario:
          clients.find((client) => client.nombreRazonSocial === selectedClient)?.codigoCliente ||
          '',
        idPuntoVenta: '1',
        idCliente: clients.find((client) => client.nombreRazonSocial === selectedClient)?.id || '',
        nitInvalido: true,
        codigoMetodoPago: 5,
        detalle: products.map((product) => ({
          idProducto: product.id,
          cantidad: product.cantidad.toString(),
          montoDescuento: product.discount ? product.discount.toFixed(2) : '00.0',
        })),
      };

      console.log(body);

      const response = await fetch(`${PATH_URL_BACKEND}/factura/emitir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // Esperar a que el temporizador termine antes de cerrar la alerta
      await new Promise((resolve) => setTimeout(resolve, 5000));
      Swal.close();

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Factura emitida con éxito',
          text: `CUF: ${data.cuf}, Número de factura: ${data.numeroFactura}`,
        }).then(() => {
          onSuccess({
            client: selectedClient,
            total: Number(paymentAmount) || total,
            numeroFactura: data.numeroFactura,
          });
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al emitir factura',
          text: 'No se pudo emitir la factura, intenta de nuevo.',
        });
      }
    } catch (error) {
      // Cerrar la alerta de carga en caso de error
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor.',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Verificación de Pago</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Método de Pago</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setPaymentMethod('Efectivo')}
              className={`flex items-center p-2 border rounded ${
                paymentMethod === 'Efectivo' ? 'bg-fifthColor' : 'bg-gray-100'
              }`}
            >
              <FaMoneyBill className="mr-2" /> Efectivo
            </button>
            <button
              onClick={() => setPaymentMethod('Tarjeta')}
              className={`flex items-center p-2 border rounded ${
                paymentMethod === 'Tarjeta' ? 'bg-fifthColor' : 'bg-gray-100'
              }`}
            >
              <FaCreditCard className="mr-2" /> Tarjeta
            </button>
            <button
              onClick={() => setPaymentMethod('QR')}
              className={`flex items-center p-2 border rounded ${
                paymentMethod === 'QR' ? 'bg-fifthColor' : 'bg-gray-100'
              }`}
            >
              <FaQrcode className="mr-2" /> QR
            </button>
            <button
              onClick={() => setPaymentMethod('Híbrido')}
              className={`flex items-center p-2 border rounded ${
                paymentMethod === 'Híbrido' ? 'bg-fifthColor' : 'bg-gray-100'
              }`}
            >
              <FaMoneyBill className="mr-2" /> Híbrido
            </button>
          </div>
        </div>

        {paymentMethod === 'Efectivo' && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Cantidad Pagada</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            {Number(paymentAmount) > total && (
              <p className="text-green-500 mt-2">
                Cambio: ${(Number(paymentAmount) - total).toFixed(2)}
              </p>
            )}
          </div>
        )}

        {paymentMethod === 'Híbrido' && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Cantidad Pagada en Efectivo</label>
            <input
              type="number"
              className="border p-2 w-full mb-4"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <label className="block mb-2 font-semibold">Cantidad Pagada en Tarjeta</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={cardAmount}
              onChange={(e) => setCardAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Cliente</label>
          <select
            className="border p-2 w-full"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.nombreRazonSocial}>
                {client.nombreRazonSocial} - {client.numeroDocumento}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Total: ${total.toFixed(2)}</h3>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2"
            onClick={handleValidate}
          >
            Validar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerifySale;
