import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';
import ProductCard from '../components/ProductCard'; 
import { Link } from 'react-router-dom';

// Definimos la interfaz del producto para TypeScript Esto ayuda a tener tipado fuerte de esta manera evito errores comunes y mejora la autocompletación en el editor.
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}
// Función para obtener los productos desde Supabase Esta función se usará con tank Query para obtener los datos de la base de datos.
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    throw new Error(error.message);
  }
  return data as Product[];
};

const ProductsPage: React.FC = () => {
  //  filtros (aún no funcionales, solo para el diseño)
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('price_asc'); // price_asc, price_desc, name_asc

  // useQuery para obtener los productos
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Simulamos el filtrado y ordenamiento para la vista de plantilla
  const filteredAndSortedProducts = React.useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Simulación de búsqueda usamos esta logica para filtrar los productos
    // por nombre o descripción según la letra o termino de búsqueda ingresado.
    // sin importar si esta en mayúsculas o minúsculas.
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Simulación de filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Simulación de ordenamiento
    const sorted = [...filtered]; // Crear una copia para no mutar el array original
    if (sortBy === 'price_asc') {
      sorted.sort((a, b) => a.price - b.price);
      //Si el usuario eligió ordenar por precio ascendente .sort() para poner los productos del más barato al más caro.
    } else if (sortBy === 'price_desc') {
      sorted.sort((a, b) => b.price - a.price);
      //Si el usuario eligió ordenar por precio descendente .sort() para poner los productos del más caro al más barato.
    } else if (sortBy === 'name_asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Si el usuario eligió ordenar por nombre ascendente .sort() para poner los productos de la A a la Z.
    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy]);


  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-xl text-gray-600">Cargando componentes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-xl">Error al cargar componentes: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Nuestros Componentes Electrónicos</h1>

      {/* Sección de Búsqueda y Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Barra de Búsqueda */}
        <input
          type="text"
          placeholder="Buscar componentes..."
          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Selector de Categoría */}
        <select
          className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Todas las Categorías</option>
          <option value="Microcontroladores">Microcontroladores</option>
          <option value="Sensores">Sensores</option>
          <option value="Actuadores">Actuadores</option>
          <option value="Placas de Desarrollo">Placas de Desarrollo</option>
          {/* Para añadir más categorías aquí */}
        </select>
        {/* Selector de Ordenar Por */}
        <select
          className="p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="name_asc">Nombre: A-Z</option>
        </select>
      </div>

      {/* Mensaje si no hay productos */}
      {filteredAndSortedProducts.length === 0 && (
        <p className="text-center text-gray-600 text-lg py-8">
          No se encontraron productos que coincidan con tu búsqueda y filtros.
        </p>
      )}
      {/* Sección de Productos en oferta*/}
      <section className="w-full max-w-5xl mx-auto flex flex-col items-center justify-start my-8">

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Productos en Oferta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* producto en oferta # 1 */}
          <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/100?text=Producto+1" alt="Producto 1" className="mb-4 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Producto -20%</h3>
            <p className="text-gray-600 text-center text-sm mb-4">Descripción breve del producto en oferta.</p>
            <Link to="/products/1" className="text-blue-600 hover:underline font-medium">
              Ver más
            </Link>
          </div>

          {/* producto en oferta # 2 */}
          <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/100?text=Producto+2" alt="Producto 2" className="mb-4 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Producto -10%</h3>
            <p className="text-gray-600 text-center text-sm mb-4">Descripción breve del producto en oferta.</p>
            <Link to="/products/2" className="text-blue-600 hover:underline font-medium">
              Ver más
            </Link>
          </div>

          {/* producto en oferta # 3 */}
          <div className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <img src="https://via.placeholder.com/100?text=Producto+3" alt="Producto 3" className="mb-4 rounded-full" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Producto -5%</h3>
            <p className="text-gray-600 text-center text-sm mb-4">Descripción breve del producto en oferta.</p>
            <Link to="/products/3" className="text-blue-600 hover:underline font-medium">
              Ver más
            </Link>
          </div>
        </div>
      </section>
      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;