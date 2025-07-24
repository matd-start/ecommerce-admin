import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

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

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Para saber si estamos editando un producto
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    stock: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // Para la carga inicial de datos en edición
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isEditing = !!id; // Verdadero si hay un ID en la URL

  // Protección de ruta y carga de datos
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
      } else {
        // Una vez que se confirma el rol, procedemos a cargar los datos si estamos editando
        if (isEditing) {
          fetchProductForEdit();
        } else {
          setPageLoading(false); // No hay datos que cargar para un nuevo producto
        }
      }
    };

    const fetchProductForEdit = async () => {
      setPageLoading(true); // Indica que la página está cargando datos iniciales
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setFormData(data);
        } else {
          setError('Producto no encontrado para editar.');
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error fetching product for edit:', errorMessage);
        setError('Error al cargar los datos del producto.');
      } finally {
        setPageLoading(false);
      }
    };

    checkAdminRole();
  }, [id, isEditing, navigate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validación básica
    if (!formData.name || !formData.category || formData.price <= 0 || formData.stock < 0) {
      setError('Por favor, completa todos los campos obligatorios y asegúrate que precio y stock son válidos.');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', id);

        if (error) {
          throw error;
        }
        setSuccess('Producto actualizado exitosamente.');
      } else {
        const { error } = await supabase
          .from('products')
          .insert(formData);

        if (error) {
          throw error;
        }
        setSuccess('Producto añadido exitosamente.');
        setFormData({ // Limpiar formulario después de añadir
          name: '',
          description: '',
          price: 0,
          image_url: '',
          category: '',
          stock: 0,
        });
      }
      // Redirigir al listado de productos después de un breve éxito
      setTimeout(() => navigate('/admin/products'), 1500); 
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error saving product:', errorMessage);
      setError('Error al guardar el producto: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="text-center py-20 text-xl text-gray-600">Cargando formulario...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre del Producto:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Precio:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">Stock:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="image_url" className="block text-gray-700 text-sm font-bold mb-2">URL de la Imagen:</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categoría:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}   
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Añadir Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;