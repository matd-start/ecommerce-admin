
import React from 'react';

// Define la interfaz para las propiedades del producto
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      {/* Imagen del producto (si la tenemos, de lo contrario un placeholder) */}
      <img
        src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-700">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
          disabled={product.stock === 0} // Deshabilita el botón si no hay stock
        >
          {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;