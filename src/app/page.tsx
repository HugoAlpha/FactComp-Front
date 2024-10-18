"use client";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "Alpha123!") {
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'Logeo Exitoso',
        text: 'Bienvenido a Alpha E-Facturación',
        showConfirmButton: false,
        timer: 3500
      }).then(() => {
        router.push('/dashboard');
      });

    } else if (email === "cajero@gmail.com" && password === "Alpha123!") {
      Swal.fire({
        position: "center",
        icon: 'success',
        title: 'Logeo Exitoso',
        text: 'Bienvenido, Cajero',
        showConfirmButton: false,
        timer: 3500
      }).then(() => {
        router.push('/dashboardCashier');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales Incorrectas',
        text: 'Por favor, verifica tu correo y contraseña',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (

    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#E6EFF7] to-[#F0F0F0]">
      <div className="bg-white shadow-2xl rounded-lg flex w-5/6 h-5/6 max-w-6xl overflow-hidden">
        <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
          <div className="mx-auto mb-4">

            <Image
              src="/images/LogoIdAlpha.png"
              alt="Logo ID"
              width={300}
              height={300}
              priority
              className="max-w-full h-auto"
            />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Inicio de Sesión</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Correo
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-[#F9F9F9]">
                <FaUserAlt className="text-gray-400 mr-3" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alpha@example.com"
                  className="bg-transparent outline-none w-full text-lg text-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-[#F9F9F9]">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu Contraseña"
                  className="bg-transparent outline-none w-full text-lg text-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-lg text-gray-600">
                <input type="checkbox" className="mr-2" />
                Recuérdame
              </label>
              <a href="#" className="text-lg text-[#10314b] hover:text-gray-500">
                ¿Olvidaste tu Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#10314b] text-white font-semibold py-3 rounded-lg text-lg hover:bg-[#10314b] transition"
            >
              Ingresar
            </button>
          </form>
          
        </div>

        {/* Logo y Recuadro */}
        <div className="w-1/2 bg-[#10314b] flex flex-col items-center justify-center p-12">
          <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">

            <Image
              src="/images/efactu2.png"
              alt="Logo"

              width={260}
              height={260}
            />
            <h2 className="text-3xl font-bold text-[#10314b] mt-6">Alpha E-Facturación</h2>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
