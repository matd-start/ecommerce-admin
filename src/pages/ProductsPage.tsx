// src/pages/ProductsPage.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient'; // Asegúrate de importar tu cliente Supabase
import ProductCard from '../components/ProductCard';

// Define la interfaz para la estructura de un producto
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    throw new Error(error.message);
  }
  return data as Product[];
};

const ProductsPage: React.FC = () => {
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['products'], // Una clave única para esta consulta
    queryFn: fetchProducts,  // La función que obtiene los datos
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-xl">Error al cargar productos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Nuestros Componentes Electrónicos</h1>

      {products && products.length === 0 && (
        <p className="text-center text-gray-600 text-lg">No hay productos disponibles en este momento.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;