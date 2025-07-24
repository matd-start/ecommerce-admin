import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link, useNavigate } from 'react-router-dom'; 

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  created_at?: string; 
}

const AdminProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook para la navegación

  // Protección de ruta (similar a AdminDashboardPage)
  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        navigate('/login', { replace: true });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profileData || profileData.role !== 'admin') {
        alert('Acceso denegado: No tienes permisos de administrador.');
        navigate('/products', { replace: true }); // Redirige a página de cliente si no es admin
      }
    };
    checkAdminRole();
  }, [navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setProducts(data as Product[]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error fetching products for admin:', errorMessage);
      setError('Error al cargar los productos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {// Si ya estamos seguros de que es admin, podemos cargar los productos
    fetchProducts();
  }, []); // Dependencia vacía para que se ejecute una vez al montar

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"? Esta acción es irreversible.`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }
      setProducts(products.filter(p => p.id !== productId));
      alert(`Producto "${productName}" eliminado exitosamente.`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error deleting product:', errorMessage);
      setError('Error al eliminar el producto. Asegúrate de tener los permisos de RLS.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 py-20">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-20">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Gestión de Productos</h1>
      <div className="flex justify-end mb-6">
        <Link 
          to="/admin/products/new" 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Añadir Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No hay productos disponibles.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Imagen</th>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Precio</th>
                <th className="py-3 px-6 text-left">Stock</th>
                <th className="py-3 px-6 text-left">Categoría</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <img 
                      src={product.image_url || 'https://via.placeholder.com/50x50?text=No+Image'} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded-md" 
                    />
                  </td>
                  <td className="py-3 px-6 text-left">{product.name}</td>
                  <td className="py-3 px-6 text-left">${product.price.toFixed(3)}</td>
                  <td className="py-3 px-6 text-left">{product.stock}</td>
                  <td className="py-3 px-6 text-left">{product.category}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <Link 
                        to={`/admin/products/edit/${product.id}`} 
                        className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition-colors duration-200 text-xs"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id, product.name)} 
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors duration-200 text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductListPage;