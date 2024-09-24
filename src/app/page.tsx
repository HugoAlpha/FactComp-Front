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

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "hugo@gmail.com" && password === "12345678") {
      Swal.fire({
        icon: 'success',
        title: 'Logeo Exitoso',
        text: 'Bienvenido a Alpha E-Facturación',
        confirmButtonColor: '#181143',
      }).then(() => {
        router.push('/dashard');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales Incorrectas',
        text: 'Por favor, verifica tu correo y contraseña',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg flex w-5/6 h-5/6 max-w-7xl">
        {/* Formulario */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <div className="mx-auto mb-1">
            <Image
              src="/images/LogoIdAlpha.png"
              alt="Logo ID"
              width={400}
              height={400}
              priority
            />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Inicio de Sesión</h2>
          <p className="mb-6 text-lg text-gray-600 text-center">
            Si aún no tienes una cuenta,{" "}
            <a href="#" className="text-[#181143] font-semibold">Regístrate aquí</a>
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Correo
              </label>
              <div className="flex items-center border rounded-lg px-4 py-3">
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
              <div className="flex items-center border rounded-lg px-4 py-3">
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
              <label className="flex items-center text-lg">
                <input type="checkbox" className="mr-2" />
                Recuérdame
              </label>
              <a href="#" className="text-lg text-[#181143] hover:text-gray-500">
                ¿Olvidaste tu Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#181143] text-white font-semibold py-3 rounded-lg text-lg hover:bg-green-700 transition"
            >
              Ingresar
            </button>
          </form>

          <p className="text-center mt-6 text-lg text-gray-500">o continúa con</p>
          <div className="flex justify-center space-x-6 mt-6">
            <button className="text-gray-500 text-3xl">
              <i className="fab fa-facebook"></i>
            </button>
            <button className="text-gray-500 text-3xl">
              <i className="fab fa-apple"></i>
            </button>
            <button className="text-gray-500 text-3xl">
              <i className="fab fa-google"></i>
            </button>
          </div>
        </div>

        {/* Logo y Recuadro */}
        <div className="w-1/2 bg-gray-50 flex flex-col items-center justify-center rounded-r-lg p-6">
          <div className="bg-gray-200 p-12 rounded-lg flex flex-col items-center">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={800}
              height={800}
              priority
            />
            <h2 className="text-3xl font-bold text-gray-800 mt-6">Alpha E-Facturación</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
