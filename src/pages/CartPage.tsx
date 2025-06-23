// src/pages/CartPage.tsx
import React from 'react';

const CartPage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold text-gray-800">Tu Carrito de Compras</h1>
      <p className="text-lg text-gray-600 mt-2">Aquí verás los productos que has añadido.</p>
    </div>
  );
};

export default CartPage;