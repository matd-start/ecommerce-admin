import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient"; 
import type { User } from "@supabase/supabase-js";
import { useSessionSync } from "../hooks/useSessionSync"; 

// Componente Navbar que maneja la navegación y autenticación del usuario
const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'admin' | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
 

useSessionSync(user, setUser, setUserRole); // Usa el hook para sincronizar sesión


const handleLogout = async () => {
  console.log("Navbar - handleLogout: iniciando cierre de sesión...");
  setLoading(true);
  setLogoutError(null);

  try {
    const logoutPromise = supabase.auth.signOut();
    const timeoutPromise = new Promise((_resolve, reject) =>
      setTimeout(() => reject(new Error("Cierre de sesión tardó demasiado. Por favor, intenta de nuevo.")), 10000)
    );

    const result = await Promise.race([logoutPromise, timeoutPromise]);

    const { error } = result as { error: import('@supabase/supabase-js').AuthError | null };

    if (error) {
      console.error("Navbar - handleLogout: error en signOut:", error.message);
      setLogoutError("Error al cerrar sesión: " + error.message);
    } else {
      console.log("Navbar - handleLogout: sesión cerrada exitosamente.");
    }
  } catch (err: unknown) {
    console.warn("Navbar - handleLogout: error en logout:", err);
    setLogoutError(err instanceof Error ? err.message : "Error desconocido");
  } finally {
    setLoading(false); 
    supabase.auth.setSession({ access_token: "", refresh_token: "" });
    setUser(null);
    setUserRole(null);
    
  }
};



  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link
          to="/"
          className="text-white text-3xl font-extrabold tracking-wide hover:text-blue-300 transition-colors duration-200 flex items-baseline border-2 border-blue-500"
        >
          <span className="text-blue-400 font-serif text-4xl mr-1 hidden sm:inline rotate-12">M</span>
          <span className="hidden sm:inline">akers</span>
          <span className="text-blue-400 font-serif text-4xl mx-1 hidden sm:inline rotate-12">S</span>
          <span className="hidden sm:inline">tore</span>
          <span className="text-blue-400 font-serif text-4xl block sm:hidden rotate-10">M</span>
          <span className="text-blue-400 font-serif text-4xl -ml-2 block sm:hidden rotate-10">S</span>{" "}
        </Link>

        <div className="flex-grow flex justify-center mt-4 md:mt-0 order-last md:order-none w-full md:w-auto">
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 text-lg font-medium">
            <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 py-1 md:py-0 block text-center">Inicio</Link></li>
            <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors duration-200 py-1 md:py-0 block text-center">Productos</Link></li>
            <li><Link to="/cart" className="text-gray-300 hover:text-white transition-colors duration-200 py-1 md:py-0 block text-center">Carrito</Link></li>
            {userRole === 'admin' && (
              <li><Link to="/admin/dashboard" className="text-yellow-300 hover:text-white transition-colors duration-200 py-1 md:py-0 block text-center">Admin</Link></li>
            )}
          </ul>
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {user ? (
            <>
              {/* CAMBIADO: La etiqueta Link solo para el perfil */}
              <Link
                to="/profile"
                className="text-white text-lg font-semibold hover:text-blue-200 transition-colors duration-200 py-1 md:py-0 block text-center"
              >
                Hola, <br />{displayName}!
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-5 rounded-md hover:bg-red-600 transition-colors duration-200 text-lg font-medium"
                disabled={loading}
              >
                {loading ? "Saliendo..." : "Cerrar Sesión"}
              </button>
              {logoutError && (
                <span className="text-red-400 text-sm ml-2">{logoutError}</span>
              )}
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white py-2 px-5 rounded-md hover:bg-blue-600 transition-colors duration-200 text-lg font-medium"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
