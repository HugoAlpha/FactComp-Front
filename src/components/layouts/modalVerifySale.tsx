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
  client: Client | null;
  onSuccess: (data: { client: string; total: number; numeroFactura: number }) => void;
  globalDiscount?: number | null;
  numeroDocumento?: string; 
}

interface Client {
  id: number;
  nombreRazonSocial: string;
  numeroDocumento: string;
  codigoCliente: string;
  codigoTipoDocumentoIdentidad: number; 
}


const ModalVerifySale: React.FC<ModalVerifySaleProps> = ({
  isOpen,
  onClose,
  products,
  total,
  client,
  onSuccess,
  globalDiscount, 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('1');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [giftCardAmount, setGiftCardAmount] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showAllMethods, setShowAllMethods] = useState(false);
  const [cardFields, setCardFields] = useState({
    firstFour: '',
    lastFour: '',
  });

  const handleCardFieldChange = (field, value) => {
    setCardFields((prev) => ({ ...prev, [field]: value.replace(/[^0-9]/g, '') }));
  };

  const isCardPayment = () => {
    const selectedMethod = paymentMethods.find(
      (method) => method.codigoClasificador === paymentMethod
    );
    return selectedMethod?.descripcion.toLowerCase().includes('tarjeta');
  };

  const isGiftCardPayment = () => {
    const selectedMethod = paymentMethods.find(
      (method) => method.codigoClasificador === paymentMethod
    );
    return (
      selectedMethod?.descripcion.toLowerCase().includes('gift card') ||
      selectedMethod?.descripcion.toLowerCase().includes('gift-card') ||
      selectedMethod?.descripcion.toLowerCase().includes('gift')
    );
  };
 
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
        // Validar si el código de documento del cliente es 5
        if (client?.codigoTipoDocumentoIdentidad === 5) {
            const nitResponse = await fetch(
                `${PATH_URL_BACKEND}/codigos/verificar-nit?nit=${client.numeroDocumento}`
            );
            const nitData = await nitResponse.json();

            if (nitResponse.ok && nitData.mensajesList[0].descripcion === 'NIT ACTIVO') {
                await processSale(false);
            } else if (nitData.mensajesList[0].descripcion === 'NIT INEXISTENTE') {
                const result = await Swal.fire({
                    icon: 'warning',
                    title: 'El NIT del cliente es inválido.',
                    text: '¿Desea proceder con el pago de todas formas?',
                    showCancelButton: true,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No',
                });

                if (result.isConfirmed) {
                    await processSale(true);
                }
            } else {
                throw new Error('Error desconocido al verificar el NIT.');
            }
        } else {
            await processSale(false);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al validar el NIT. Por favor, intente de nuevo.',
        });
        console.error(error);
    }
};

  const processSale = async (nitInvalido: boolean) => {
    try {
      let timerInterval;
      Swal.fire({
        title: 'Se está generando la factura',
        html: 'Espere mientras procesamos su factura.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
  
      const contingenciaEstado = localStorage.getItem('contingenciaEstado');
      const numeroTarjeta = isCardPayment()
        ? `${cardFields.firstFour}00000000${cardFields.lastFour}`
        : null;
  
      const body = {
        usuario: client?.codigoCliente || '',
        idPuntoVenta: parseInt(localStorage.getItem('idPOS') as string),
        idCliente: client?.id || '',
        idSucursal: parseInt(localStorage.getItem('idSucursal') as string),
        nitInvalido, 
        codigoMetodoPago: paymentMethod,
        activo: contingenciaEstado === '1' ? false : true,
        numeroFactura: '',
        fechaHoraEmision: '',
        cafc: false,
        numeroTarjeta,
        montoGiftCard: isGiftCardPayment() ? parseFloat(giftCardAmount) : null,
        descuentoGlobal: globalDiscount || null,
        detalle: products.map((product) => ({
          idProducto: product.id,
          cantidad: product.cantidad.toString(),
          montoDescuento: product.discount ? product.discount.toFixed(2) : '00.0',
        })),
      };
  
      const response = await fetch(
        `${PATH_URL_BACKEND}/factura/emitir-computarizada`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
  
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
        if (errorData.message === 'Cufd Inexistente') {
          Swal.fire({
            icon: 'error',
            title: 'Error al emitir factura',
            text: 'CUFD no vigente. Por favor, verificar el estado de éste.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al emitir factura',
            text:
              errorData.message ||
              'No se pudo emitir la factura, intenta de nuevo.',
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
      console.error(error);
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
                className={`flex items-center p-2 border rounded ${paymentMethod === method.codigoClasificador ? 'bg-fifthColor' : 'bg-gray-100'
                  }`}
              >
                {method.descripcion}
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
                    !defaultMethods.some(
                      (defaultMethod) => defaultMethod.codigoClasificador === method.codigoClasificador
                    )
                )
                .map((method) => (
                  <button
                    key={method.codigoClasificador}
                    onClick={() => setPaymentMethod(method.codigoClasificador)}
                    className={`flex items-center p-2 border rounded mb-2 ${paymentMethod === method.codigoClasificador ? 'bg-fifthColor' : 'bg-gray-100'
                      }`}
                  >
                    {method.descripcion}
                  </button>
                ))}
            </div>
          )}
        </div>

        {isCardPayment() && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">4 Primeros Números de la Tarjeta</label>
            <input
              type="text"
              maxLength={4}
              value={cardFields.firstFour}
              onChange={(e) => handleCardFieldChange('firstFour', e.target.value)}
              className="border p-2 w-full"
            />
            <label className="block mb-2 font-semibold mt-4">4 Últimos Números de la Tarjeta</label>
            <input
              type="text"
              maxLength={4}
              value={cardFields.lastFour}
              onChange={(e) => handleCardFieldChange('lastFour', e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        )}

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

        {isGiftCardPayment() && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Monto de Gift Card</label>
            <input
              type="number"
              className="border p-2 w-full"
              value={giftCardAmount}
              onChange={(e) => setGiftCardAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            />
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-bold">Total: Bs.{total.toFixed(2)}</h3>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
            onClick={handleValidate}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  );

};

export default ModalVerifySale;
