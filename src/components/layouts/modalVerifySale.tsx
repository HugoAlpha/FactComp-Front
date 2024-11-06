import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaMoneyBill } from 'react-icons/fa';
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
  client: Client | null;
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
  client,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('1');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showAllMethods, setShowAllMethods] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(`${PATH_URL_BACKEND}/parametro/metodo-pago`);
        if (response.ok) {
          const data = await response.json();
          setPaymentMethods(data);
        }
      } catch (error) {
        Swal.fire('Error', 'No se pudieron obtener los métodos de pago.', 'error');
      }
    };
    fetchPaymentMethods();
  }, []);

  const handleValidate = async () => {
    if (paymentMethod === '1' && Number(paymentAmount) < total) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad pagada es insuficiente.',
      });
      return;
    }

    if (paymentMethod === '10') {
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

      const contingenciaEstado = localStorage.getItem('contingenciaEstado');
      const body = {
        usuario: client?.codigoCliente || '',
        idPuntoVenta: parseInt(localStorage.getItem('idPOS') as string),
        idCliente: client?.id || '',
        idSucursal: parseInt(localStorage.getItem('idSucursal') as string),
        nitInvalido: true,
        codigoMetodoPago: paymentMethod,
        activo: contingenciaEstado === '1' ? false : true,
        detalle: products.map((product) => ({
          idProducto: product.id,
          cantidad: product.cantidad.toString(),
          montoDescuento: product.discount ? product.discount.toFixed(2) : '00.0',
        })),
      };

      const response = await fetch(`${PATH_URL_BACKEND}/factura/emitir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

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
            client: client?.nombreRazonSocial || '',
            total: Number(paymentAmount) || total,
            numeroFactura: data.numeroFactura,
          });
        });
      } else {
        const errorData = await response.json();
        if (errorData.message === "Cufd Inexistente") {
          Swal.fire({
            icon: 'error',
            title: 'Error al emitir factura',
            text: 'CUFD no vigente. Por favor, verificar el estado de éste.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al emitir factura',
            text: errorData.message || 'No se pudo emitir la factura, intenta de nuevo.',
          });
        }
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor.',
      });
    }

  };

  if (!isOpen) return null;

  const defaultMethods = [
    { descripcion: 'Efectivo', codigoClasificador: '1' },
    { descripcion: 'Tarjeta', codigoClasificador: '2' },
    { descripcion: 'QR', codigoClasificador: '7' },
    { descripcion: 'Híbrido', codigoClasificador: '10' },
  ];

  return (
    <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Verificación de Pago</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Método de Pago</label>
          <div className="flex space-x-4">
            {defaultMethods.map((method) => (
              <button
                key={method.codigoClasificador}
                onClick={() => setPaymentMethod(method.codigoClasificador)}
                className={`flex items-center p-2 border rounded ${paymentMethod === method.codigoClasificador ? 'bg-fifthColor' : 'bg-gray-100'}`}
              >
                <FaMoneyBill className="mr-2" /> {method.descripcion}
              </button>
            ))}
            {paymentMethods.length > defaultMethods.length && (
              <button
                onClick={() => setShowAllMethods((prev) => !prev)}
                className="flex items-center p-2 border rounded bg-gray-100"
              >
                {showAllMethods ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
          {showAllMethods && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              {paymentMethods
                .filter(
                  (method) =>
                    !defaultMethods.some((defaultMethod) => defaultMethod.codigoClasificador === method.codigoClasificador)
                )
                .map((method) => (
                  <button
                    key={method.codigoClasificador}
                    onClick={() => setPaymentMethod(method.codigoClasificador)}
                    className={`flex items-center p-2 border rounded mb-2 ${paymentMethod === method.codigoClasificador ? 'bg-fifthColor' : 'bg-gray-100'}`}
                  >
                    {method.descripcion}
                  </button>
                ))}
            </div>
          )}
        </div>

        {paymentMethod === '1' && (
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
                Cambio: Bs.{(Number(paymentAmount) - total).toFixed(2)}
              </p>
            )}
          </div>
        )}

        {paymentMethod === '10' && (
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
          <h3 className="text-lg font-bold">Total: Bs.{total.toFixed(2)}</h3>
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