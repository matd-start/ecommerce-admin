import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useCartStore } from '../store/cartStore'; // Importa el store

// Interfaz para un producto
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad a añadir

  const addItem = useCartStore((state) => state.addItem); // Acción para añadir al carrito

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError('ID de producto no proporcionado.');
        setLoading(false);
        return;
      }
      try {
        // Obtener datos de un solo producto
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProduct(data as Product);
        } else {
          setError('Producto no encontrado.');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error fetching product:', errorMessage);
        setError('Error al cargar el producto. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-160px)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 text-xl">{error}</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 hover:underline">
          Volver a Productos
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-xl">Producto no disponible.</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 hover:underline">
          Volver a Productos
        </button>
      </div>
    );
  }

  // Verificar si el producto está agotado
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (product) {
      addItem(product); // Añade solo el producto al carrito
      navigate('/cart'); // Opcional: redirige al carrito después de añadir
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-8">
        {/* Columna de Imagen */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={product.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={product.name}
            className="w-full max-w-lg h-auto rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Columna de Detalles */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}</p>
          
          <div className="flex items-baseline mb-6">
            <span className="text-5xl font-extrabold text-blue-700 mr-4">${product.price.toFixed(3)}</span>
            {isOutOfStock ? (
              <span className="text-red-600 text-xl font-semibold">AGOTADO</span>
            ) : (
              <span className="text-green-600 text-lg font-semibold">
                En Stock: {product.stock} unidades
              </span>
            )}
          </div>

          {!isOutOfStock && (
            <div className="flex items-center gap-4 mb-8">
              <label htmlFor="quantity" className="text-lg font-medium text-gray-700">Cantidad:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock} // Limita la cantidad al stock disponible
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Asegura que sea al menos 1
                className="w-24 p-2 border border-gray-300 rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-6 rounded-lg text-xl font-semibold transition-colors duration-300 transform hover:scale-105 ${
              isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Producto Agotado' : 'Añadir al Carrito'}
          </button>

          <button
            onClick={() => navigate('/products')}
            className="mt-4 w-full py-3 px-6 rounded-lg text-lg font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors duration-300"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
