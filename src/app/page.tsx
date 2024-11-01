"use client";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { PATH_URL_SECURITY } from "@/utils/constants";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${PATH_URL_SECURITY}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username,
          password
        }).toString()
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.response === "200") {
          localStorage.setItem("username", username);
          
          localStorage.setItem("role", data.role);
          localStorage.setItem("tokenJWT", data.tokenJWT);
          localStorage.setItem("idEmpresa", data.id_empresa);
  
          Swal.fire({
            position: "center",
            icon: 'success',
            title: data.message,
            text: 'Bienvenido a Alpha E-Facturación',
            showConfirmButton: false,
            timer: 3500
          }).then(() => {
            if (data.role === "ROLE_ADMIN") {
              router.push('/selectionBranch');
            } else if (data.role === "ROLE_USER") {
              router.push('/selectionPOS');
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Usuario no encontrado',
            text: 'Por favor, verifica tus credenciales',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de servidor',
          text: 'No se pudo conectar con el servidor',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'Hubo un problema al conectar con el servidor',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#E6EFF7] to-[#F0F0F0]">
      <div className="bg-white shadow-2xl rounded-lg flex w-5/6 h-5/6 max-w-6xl overflow-hidden">
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white">
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

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Inicio de Sesión</h2>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Usuario
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-[#F9F9F9]">
                <FaUserAlt className="text-gray-400 mr-3" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="bg-transparent outline-none w-full text-sm md:text-lg text-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-[#F9F9F9] relative">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu Contraseña"
                  className="bg-transparent outline-none w-full text-sm md:text-lg text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <label className="flex items-center text-sm md:text-lg text-gray-600 mb-2 md:mb-0">
                <input type="checkbox" className="mr-2" />
                Recuérdame
              </label>
              <a href="#" className="text-sm md:text-lg text-[#10314b] hover:text-gray-500">
                ¿Olvidaste tu Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#10314b] text-white font-semibold py-3 rounded-lg text-sm md:text-lg hover:bg-[#10314b] transition"
            >
              Ingresar
            </button>
          </form>
        </div>

        {/* Logo y Recuadro */}
        <div className="hidden md:flex md:w-1/2 bg-[#10314b] flex-col items-center justify-center p-12">
          <div className="bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">
            <Image
              src="/images/efactu2.png"
              alt="Logo"
              width={260}
              height={260}
            />
            <h2 className="text-2xl md:text-3xl font-bold text-[#10314b] mt-4 md:mt-6">Alpha E-Facturación</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
