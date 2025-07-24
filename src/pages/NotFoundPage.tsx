import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Página No Encontrada</h2>
        <p className="text-lg text-gray-600 mb-8">Lo sentimos, la página que buscas no existe.</p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300"
        >
          Volver a la Página Principal
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;