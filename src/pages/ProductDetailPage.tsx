import { Link } from 'react-router-dom';
import React from 'react';
import { useParams } from 'react-router-dom'; 
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient'; 

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}

// Función para obtener un producto por su ID
const fetchProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();

  if (error) {
    // Si no se encuentra el producto, Supabase lanza un error si single() no devuelve nada
    // Podemos manejarlo para devolver null o un error específico
    if (error.code === 'PGRST116') { // Código de error si no encuentra un single row
      return null;
    }
    throw new Error(error.message);
  }
  return data as Product;
};

const ProductDetailPage: React.FC = () => {
  // Obtenemos el ID del producto de los parámetros de la URL
  const { id } = useParams<{ id: string }>();

  // Usamos useQuery para obtener los detalles del producto
  const { data: product, isLoading, isError, error } = useQuery<Product | null, Error>({
    queryKey: ['product', id], // La clave de la consulta ahora incluye el ID
    queryFn: () => (id ? fetchProductById(id) : Promise.resolve(null)), // Asegúrate de que id exista
    enabled: !!id, // Solo ejecuta la consulta si id tiene un valor
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Cargando detalles del componente...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-xl">Error al cargar el componente: {error.message}</p>
      </div>
    );
  }

  if (!product) {// Si no se encuentra el producto, mostramos un mensaje de error
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Componente No Encontrado</h2>
        <p className="text-lg text-gray-600">
          Lo sentimos, el componente que buscas no lo tenemos ahora.
        </p>
        <Link to="/products" className="mt-6 inline-block bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200">
          Volver a Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <Link to="/products" className="flex items-center text-blue-600 hover:underline mb-6 text-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Volver a la lista de productos
      </Link>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden p-6 lg:p-10 flex flex-col lg:flex-row gap-8">
        {/* Columna Izquierda: Imagen del Producto */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <img
            src={product.image_url || 'https://via.placeholder.com/600x400?text=Imagen+No+Disponible'}
            alt={product.name}
            className="w-full max-w-lg h-auto rounded-lg shadow-md object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Columna Derecha: Detalles del Producto */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-blue-700 text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center mb-6">
            <span className="text-gray-600 font-semibold mr-2">Categoría:</span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{product.category}</span>
          </div>

          <div className="flex items-center mb-8">
            <span className="text-gray-600 font-semibold mr-2">Disponibilidad:</span>
            {product.stock > 0 ? (
              <span className="text-green-600 font-bold text-lg">En Stock ({product.stock} unidades)</span>
            ) : (
              <span className="text-red-600 font-bold text-lg">Agotado</span>
            )}
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
            // Aquí se añadiría la lógica para añadir al carrito
          >
            {product.stock > 0 ? 'Añadir al Carrito' : 'Producto Agotado'}
          </button>

          {/* Opcional: Sección de Características  */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Especificaciones Clave</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Voltaje de Operación: 3.3V / 5V</li>
              <li>Interfaz: I2C, SPI, UART</li>
              <li>Dimensiones: X mm x Y mm</li>
              {/* Aquí irían datos más específicos del producto */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
