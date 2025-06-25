// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Usaremos react-router-dom más adelante

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Makers Store
        </Link>
        <div className="space-x-4">
          <Link to="/products" className="hover:text-blue-200">
            Productos
          </Link>
          <Link to="/cart" className="hover:text-blue-200">
            Carrito
          </Link>
          {/* Aquí podríamos añadir enlaces de autenticación, que veremos después */}
          <Link to="/login" className="hover:text-blue-200">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;