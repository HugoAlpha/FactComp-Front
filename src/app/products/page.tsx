import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';

const ProductList = () => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Contenido principal */}
            <div className="flex flex-col w-full min-h-screen">
                {/* Header */}
                <Header />

                {/* Contenido principal */}
                <div className="p-6 bg-gray-50 h-screen w-full">
                    <h1 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Productos</h1>

                    {/* Botón para agregar producto */}
                    <div className="flex justify-end mb-4">
                        <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-lg">
                            Agregar Producto
                        </button>
                    </div>

                    {/* Tabla de productos */}
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Descripción</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Costo c/u</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Descuento</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Cantidad</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Total</th>
                                <th className="px-4 py-2 border text-left font-semibold text-gray-700">Operación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Producto 1 */}
                            <tr className="border-b">
                                <td className="px-4 py-4 flex items-center space-x-4">
                                    <img src="/images/imac.png" alt="Producto 1" className="w-16 h-16 rounded-md object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800">ARDUINO IV AZUL</p>
                                        <p className="text-sm text-gray-600">Descripción uno</p>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-800">20 Bs.</td>
                                <td className="px-4 py-4 text-gray-800">0.5%</td>
                                <td className="px-4 py-4 text-gray-800">1</td>
                                <td className="px-4 py-4 text-gray-800">20 Bs.</td>
                                <td className="px-4 py-4 flex space-x-2">
                                    {/* Iconos de Borrar y Editar */}
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaTrashAlt />
                                    </button>
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>

                            {/* Producto 2 */}
                            <tr className="border-b">
                                <td className="px-4 py-4 flex items-center space-x-4">
                                    <img src="/images/ipad-11.png" alt="Producto 2" className="w-16 h-16 rounded-md object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800">ARDUINO IV AZUL</p>
                                        <p className="text-sm text-gray-600">Descripción uno</p>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-800">20 Bs.</td>
                                <td className="px-4 py-4 text-gray-800">0.5%</td>
                                <td className="px-4 py-4 text-gray-800">1</td>
                                <td className="px-4 py-4 text-gray-800">20 Bs.</td>
                                <td className="px-4 py-4 flex space-x-2">
                                    {/* Iconos de Borrar y Editar */}
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaTrashAlt />
                                    </button>
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>

                            {/* Producto 3 */}
                            <tr className="border-b">
                                <td className="px-4 py-4 flex items-center space-x-4">
                                    <img src="/images/iphone-12.png" alt="Producto 3" className="w-16 h-16 rounded-md object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-800">ARDUINO IV AZUL</p>
                                        <p className="text-sm text-gray-600">Descripción uno</p>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-800">20 Bs.</td>
                                <td className="px-4 py-4 text-gray-800">0.5%</td>
                                <td className="px-4 py-4 text-gray-800">1</td>
                                <td className="px-4 py-4 text-gray-800">20 Bs.</td>
                                <td className="px-4 py-4 flex space-x-2">
                                    {/* Iconos de Borrar y Editar */}
                                    <button className="text-red-500 hover:text-red-700">
                                        <FaTrashAlt />
                                    </button>
                                    <button className="text-blue-500 hover:text-blue-700">
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="mt-4 flex justify-between">
                        <button className="text-gray-600">Previous</button>
                        <div className="space-x-2">
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">1</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">2</button>
                            <button className="bg-gray-300 text-gray-800 py-1 px-3 rounded">3</button>
                        </div>
                        <button className="text-gray-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
