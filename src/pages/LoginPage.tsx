import React, { useState } from "react";
import LockIcon from "../components/LockIcon"; // Importa el componente del candado

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true); // Controla si mostramos Login o Registro
  const [isAuthSuccess, setIsAuthSuccess] = useState(false); // Simula el éxito de autenticación

  // Datos de formulario simulados para el diseño
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuthAction = () => {
    // Simular una llamada a la API de Supabase aquí
    console.log(
      `Intentando ${isLoginView ? "iniciar sesión" : "registrar"} con:`,
      { email, password }
    );

    // Simular un éxito de autenticación después de un pequeño retraso
    setTimeout(() => {
      setIsAuthSuccess(true); // Cambia el estado para abrir el candado
      // En implementación real, aquí navegaría al dashboard o página de inicio secion y logica pendiente en implementar
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthSuccess(false); // Cierra el candado
    // En la implementación real, aquí se hace logout de Supabase
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    console.log("Sesión cerrada.");
  };

  return (
    <div className="flex justify-center items-center py-12 min-h-[calc(100vh-160px)] bg-gray-50">
      <div className="relative w-full max-w-4xl min-h-[400px] h-auto md:h-[450px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sección Izquierda - Formulario (Login/Registro) */}
        <div
          className={`relative w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 transition-transform duration-700 ease-in-out ${
            isAuthSuccess
              ? "-translate-x-full md:!translate-x-0"
              : "translate-x-0"
          } ${isAuthSuccess ? "absolute" : "relative"} md:static`} // Ajustes para que en móvil la sección desaparezca
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            {isLoginView ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>

          {isAuthSuccess ? (
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                ¡Bienvenido de Nuevo!
              </h3>
              <p className="text-gray-600 mb-6">
                Has iniciado sesión correctamente.
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLoginView ? "current-password" : "new-password"}
              />
              {!isLoginView && (
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  className="mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              )}

              <button
                onClick={handleAuthAction}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                {isLoginView ? "Iniciar Sesión" : "Registrarse"}
              </button>

              <p className="mt-6 text-center text-gray-600">
                {isLoginView
                  ? "¿No tienes una cuenta?"
                  : "¿Ya tienes una cuenta?"}
                <button
                  onClick={() => {
                    setIsLoginView(!isLoginView);
                    setIsAuthSuccess(false); // Resetear el estado de éxito al cambiar de vista
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-blue-600 hover:underline ml-2 font-medium"
                >
                  {isLoginView ? "Regístrate aquí" : "Iniciar Sesión"}
                </button>
              </p>
            </>
          )}
        </div>

        {/* Sección Derecha - Candado / Mensaje de Bienvenida */}
        <div className="w-full md:w-1/2 h-full bg-blue-700 flex flex-col items-center justify-center p-8 md:p-12 text-white text-center">
          {isAuthSuccess ? (
            <>
              <h3 className="text-4xl font-extrabold mb-4">
                ¡Acceso Concedido!
              </h3>
              <p className="text-xl opacity-90 mb-6">
                Tu mundo de componentes te espera.
              </p>
              <LockIcon isOpen={true} /> {/* El candado se muestra abierto */}
            </>
          ) : (
            <>
              
              <h3 className="text-4xl font-extrabold mt-6 mb-3">
                Seguro y Simple
              </h3>
              <p className="text-lg opacity-90">
                Tu portal seguro para los mejores componentes electrónicos.
              </p>
              <LockIcon isOpen={false} /> {/* El candado se muestra cerrado */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
