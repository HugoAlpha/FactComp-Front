import React from 'react';
import { FaBuilding, FaIdCard, FaMapMarkedAlt, FaPhone, FaCity, FaClipboardList } from 'react-icons/fa';

interface Enterprise {
    id: number;
    nit: string;
    nombreEmpresa: string;
    sucursales: string;
    direccion: string;
    zona: string;
    telefono: string;
    ciudad: string;
    modalidad: string;
    logo: string;
}

interface EnterpriseModalProps {
    isOpen: boolean;
    onClose: () => void;
    enterprise: Enterprise;
    onSave: (enterprise: Enterprise) => void;
}

const CreateEditEnterpriseModal: React.FC<EnterpriseModalProps> = ({ isOpen, onClose, enterprise, onSave }) => {
    const [formData, setFormData] = React.useState<Enterprise>(enterprise);
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

    React.useEffect(() => {
        setFormData(enterprise);
        setErrors({});
    }, [enterprise, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nit) newErrors.nit = 'Este campo es requerido';
        if (!formData.nombreEmpresa) newErrors.nombreEmpresa = 'Este campo es requerido';
        if (!formData.sucursales) newErrors.sucursales = 'Este campo es requerido';
        if (!formData.direccion) newErrors.direccion = 'Este campo es requerido';
        if (!formData.zona) newErrors.zona = 'Este campo es requerido';
        if (!formData.telefono) newErrors.telefono = 'Este campo es requerido';
        if (!formData.ciudad) newErrors.ciudad = 'Este campo es requerido';
        if (!formData.modalidad) newErrors.modalidad = 'Este campo es requerido';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-500">
                <div className="bg-green-700 text-white text-lg font-semibold p-4 rounded-t">
                    {enterprise.id ? 'Edición de Empresa' : 'Agregación de Empresa'}
                </div>
                <div className="p-6 m-6">
                    <div className="grid grid-cols-1 gap-6 text-black">
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("nit", "NIT", formData.nit, handleInputChange, <FaIdCard />, errors.nit)}
                            {renderInputField("nombreEmpresa", "Nombre Empresa", formData.nombreEmpresa, handleInputChange, <FaBuilding />, errors.nombreEmpresa)}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("sucursales", "Sucursales", formData.sucursales, handleInputChange, <FaClipboardList />, errors.sucursales)}
                            {renderInputField("direccion", "Dirección", formData.direccion, handleInputChange, <FaMapMarkedAlt />, errors.direccion)}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("zona", "Zona", formData.zona, handleInputChange, <FaMapMarkedAlt />, errors.zona)}
                            {renderInputField("telefono", "Teléfono", formData.telefono, handleInputChange, <FaPhone />, errors.telefono)}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {renderInputField("ciudad", "Ciudad", formData.ciudad, handleInputChange, <FaCity />, errors.ciudad)}
                            {renderInputField("modalidad", "Modalidad", formData.modalidad, handleInputChange, <FaClipboardList />, errors.modalidad)}
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                            {enterprise.id ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const renderInputField = (
    name: string,
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    icon: React.ReactNode,
    error?: string
) => (
    <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <div className="flex items-center border rounded">
            <span className="p-2 text-gray-600">{icon}</span>
            <input
                type="text"
                name={name}
                className={`border-0 p-2 w-full rounded focus:ring-0 ${error ? 'border-red-500' : ''}`}
                placeholder={`Ingrese ${label.toLowerCase()}`}
                value={value}
                onChange={onChange}
            />
        </div>
        {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
);

export default CreateEditEnterpriseModal;
