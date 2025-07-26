import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabaseClient";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import ofertaImg1 from '../assets/imagesofertas/oferta1.jpeg';
import ofertaImg2 from '../assets/imagesofertas/oferta2.jpeg';
import ofertaImg3 from '../assets/imagesofertas/oferta3.jpeg';

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


  const offerProducts = [
    { id: 1, name: "Producto en Oferta 1", description: "Placa de desarrollo potente con un descuento imperdible. Ideal para prototipado rápido", imageUrl: ofertaImg1, discount: "5%" },
    { id: 2, name: "Producto en Oferta 2", description: "Descubre esta oferta increíble por tiempo limitado en nuestro componente más usado. ¡No te lo pierdas! ", imageUrl: ofertaImg2, discount: "10%" },
    { id: 3, name: "Producto en Oferta 3", description: "Aprovecha este descuento especial de alta precisión, perfecto para tus proyectos.", imageUrl: ofertaImg3, discount: "15%" },
  ];
// Función para obtener los productos desde Supabase Esta función se usará con tank Query para obtener los datos de la base de datos.
const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data as Product[];
};

const ProductsPage: React.FC = () => {
  //  filtros y ordenamiento
  // Estado para la búsqueda, categoría y ordenamiento
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("price_asc"); // price_asc, price_desc, name_asc

  // useQuery para obtener los productos
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filteredAndSortedProducts = React.useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // logica para filtrar los productos
    // por nombre o descripción según la letra o termino de búsqueda ingresado.
    // sin importar si esta en mayúsculas o minúsculas.
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Simulación de filtro por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Ordenamiento
    const sorted = [...filtered]; // Crear una copia para no mutar el array original
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => a.price - b.price);
      //Si el usuario eligió ordenar por precio ascendente .sort() para poner los productos del más barato al más caro.
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => b.price - a.price);
      //Si el usuario eligió ordenar por precio descendente .sort() para poner los productos del más caro al más barato.
    } else if (sortBy === "name_asc") {
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen"> {/* Fondo más claro para toda la página */}
      <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-10 tracking-tight"> {/* Título más grande y llamativo */}
        Explora Nuestros Componentes Electrónicos
      </h1>

      {/* Sección de Búsqueda y Filtros */}
      <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-lg mb-12 flex flex-col md:flex-row justify-between items-center gap-6 max-w-6xl mx-auto"> {/* Fondo blanco, borde sutil, sombra para destacar */}
        {/* Barra de Búsqueda */}
        <input
          type="text"
          placeholder="Buscar componentes..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 text-lg" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Selector de Categoría */}
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 text-lg" 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Todas las Categorías</option>
          <option value="Microcontroladores">Microcontroladores</option>
          <option value="Sensores">Sensores</option>
          <option value="Actuadores">Actuadores</option>
          <option value="Placas de Desarrollo">Placas de Desarrollo</option>
        </select>

        {/* Selector de Ordenar Por */}
        <select
          className="p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-3 focus:ring-blue-500 transition-all duration-300 text-lg" 
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
        <div className="text-center bg-yellow-50 text-yellow-800 p-6 rounded-xl shadow-md max-w-2xl mx-auto my-10"> {/* Mensaje más prominente */}
          <p className="text-xl font-semibold">
            ¡Oops! No encontramos componentes que coincidan con tu búsqueda.
          </p>
          <p className="text-md mt-2">
            Intenta ajustar tus filtros o tu término de búsqueda.
          </p>
        </div>
      )}

      {/* Sección de Productos en Oferta */}
      <section className="w-full max-w-6xl mx-auto my-16 bg-blue-50 rounded-3xl p-10 shadow-xl">
        <h2 className="text-4xl font-extrabold text-blue-800 text-center mb-10">
          Ofertas Exclusivas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {offerProducts.map((product) => ( // Ahora iteramos sobre nuestro array de ofertas
            <div
              key={product.id}
              className="bg-white border border-blue-100 rounded-2xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold px-4 py-1 rounded-bl-lg transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                -{product.discount} DCTO
              </div>
              <img
                src={product.imageUrl} // Usamos la URL de la imagen de nuestro array
                alt={product.name}
                className="mb-6 rounded-full border-4 border-blue-200 shadow-md w-32 h-32 object-cover" // Añadí w-32 h-32 y object-cover para un tamaño fijo y buena visualización
              />
              <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                {product.name}
              </h3>
              <p className="text-gray-600 text-center text-md mb-6 leading-relaxed">
                {product.description}
              </p>
              <Link
                to={`/products/${product.id}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              >
                Ver más detalles
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path><path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 max-w-6xl mx-auto"> {/* Espacio aumentado, cuadrícula centrada */}
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
