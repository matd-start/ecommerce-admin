import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string | null;
    category: string;
    stock: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [addedToCart, setAddedToCart] = useState(false); // Nuevo estado para el feedback

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (product && !isOutOfStock) {
      addItem(product);
      setAddedToCart(true); // Activa el estado de "añadido"
      setTimeout(() => {
        setAddedToCart(false); // Desactiva el estado después de 1.5 segundos
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <Link to={`/products/${product.id}`} className="block relative h-48 overflow-hidden">
        <img
          src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-75 flex items-center justify-center">
            <span className="text-white text-xl font-bold">AGOTADO</span>
          </div>
        )}
      </Link>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
          <Link to={`/products/${product.id}`} className="hover:text-blue-600">
            {product.name}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
          <span className="text-2xl font-bold text-blue-700">${product.price.toFixed(3)}</span>
          <button
            onClick={handleAddToCart} //  función handleAddToCart
            className={`py-1 px-2 rounded-md text-white font-semibold transition-colors duration-300 relative overflow-hidden
              ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' :
                addedToCart ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700' // Cambia de color si se añadió
              }`}
            disabled={isOutOfStock || addedToCart} // Deshabilita si está agotado o si la animación está activa
          >
            {addedToCart ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ¡Añadido!
              </span>
            ) : (
              isOutOfStock ? 'Sin Stock' : 'Al Carrito'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;