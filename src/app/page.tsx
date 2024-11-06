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

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, complete ambos campos para iniciar sesión.',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    try {
      const response = await fetch(`${PATH_URL_SECURITY}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: trimmedUsername,
          password: trimmedPassword
        }).toString()
      });

      let data;
      if (response.headers.get("content-type")?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok && typeof data === "object" && data.response === "200") {
        localStorage.setItem("username", trimmedUsername);
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
        const errorMessage = typeof data === "string" ? data : data.message || 'Error de inicio de sesión.';

        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: errorMessage,
          showConfirmButton: false,
          timer: 2500
        });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'Hubo un problema, verifica usuario y contraseña',
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#d8e3e8] to-[#e8f3f5] ">
      <div className="bg-white shadow-lg rounded-3xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        <div className="hidden md:flex md:w-1/2 bg-[#10314b] flex-col items-center justify-center p-8 text-white rounded-l-3xl shadow-lg relative">
          <div className="flex flex-col items-center justify-center text-center ">
            <Image
              src="/images/efactu2.png"
              alt="Logo Alpha"
              width={220}
              height={220}

            />
            <h2 className="text-3xl font-bold mt-6">Alpha E-Facturación</h2>
            <p className="mt-4 text-lg px-4">Gestión eficiente de tus facturas con Alpha E-Facturación. ¡Hazlo fácil y rápido!</p>
          </div>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white rounded-r-3xl">
          <div className="mx-auto mb-6">
            <Image
              src="/images/LogoIdAlpha.png"
              alt="Logo ID"
              width={150}
              height={150}
              priority
              className="max-w-full h-auto"
            />
          </div>

          <h2 className="text-3xl font-bold text-center text-[#10314b] mb-6">Inicio de Sesión</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-600 mb-2">Usuario</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-[#F1F1F1]">
                <FaUserAlt className="text-gray-400 mr-3" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="bg-transparent outline-none w-full text-gray-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-600 mb-2">Contraseña</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-[#F1F1F1] relative">
                <FaLock className="text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu Contraseña"
                  className="bg-transparent outline-none w-full text-gray-800"
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

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" />
                Recuérdame
              </label>
              <a href="#" className="text-sm text-[#5086A8] hover:underline">¿Olvidaste tu Password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#5086A8] text-white font-semibold py-2 rounded-lg hover:bg-[#10314b] transition-all duration-300 ease-in-out shadow-md"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
