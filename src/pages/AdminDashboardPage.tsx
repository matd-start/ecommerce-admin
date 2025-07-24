import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

const AdminDashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        console.error('No session found or error fetching session:', sessionError?.message);
        navigate('/login'); // No hay sesión o error, redirigir al login
        return;
      }

      setUser(session.user);

      // Obtener el rol del usuario
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error al obtener el perfil del usuario:', profileError.message);
        navigate('/login'); // Si hay error al obtener el rol, redirigir al login
        return;
      }

      setUserRole(profileData.role);
      setLoading(false);

      // Si no es admin, redirigir
      if (profileData.role !== 'admin') {
        alert('Acceso denegado: No tienes permisos de administrador.');
        navigate('/products'); // Redirige a una página de cliente si no es admin
      }
    };

    checkAuthAndRole();
    // Suscribirse a cambios de autenticación para reaccionar a logout
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
            // Si el usuario cierra sesión, redirigir
            navigate('/login');
        }
    });

    return () => {
        authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-600">Cargando panel de administración...</div>;
  }

  if (userRole !== 'admin') {
    // Esto ya se maneja con la redirección en useEffect, pero es una buena práctica defensiva.
    return <div className="text-center py-20 text-xl text-red-600">Acceso denegado.</div>;
  }

  // Nombre a mostrar
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrador';

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Bienvenido, {displayName}</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-center">Panel de Administración</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold text-blue-600 mb-3">Gestión de Productos</h3>
          <p className="text-gray-600 mb-4">Añade, edita o elimina productos de la tienda.</p>
          <Link to="/admin/products" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
            Ir a Productos
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold text-green-600 mb-3">Reportes de Ventas</h3>
          <p className="text-gray-600 mb-4">Visualiza gráficos y reportes de ventas.</p>
          <Link to="/admin/reports" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
            Ir a Reportes
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold text-purple-600 mb-3">Gestión de Usuarios</h3>
          <p className="text-gray-600 mb-4">Administra los usuarios y sus roles.</p>
          <Link to="/admin/users" className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors">
            Ir a Usuarios
          </Link>
        </div>
      </div>
      {/*añadir más secciones aquí */}
    </div>
  );
};

export default AdminDashboardPage;