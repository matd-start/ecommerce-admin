// src/pages/AdminReportsPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Protección de ruta (solo para admins)
  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        console.error('AdminReports: No hay sesión o error al obtenerla.', sessionError?.message);
        navigate('/login', { replace: true });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profileData || profileData.role !== 'admin') {
        console.warn('AdminReports: Acceso denegado. Rol no es admin o perfil no encontrado.', profileError?.message);
        alert('Acceso denegado: No tienes permisos de administrador para ver reportes.');
        navigate('/products', { replace: true });
        return;
      }
      setLoading(false);
    };

    checkAdminRole();
  }, [navigate]);

  if (loading) {
    return <p className="text-center py-20 text-xl text-gray-600">Cargando reportes...</p>;
  }

  if (error) {
    return <p className="text-center py-20 text-xl text-red-600">{error}</p>;
  }
  

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Reportes de Ventas</h1>
      <p className="text-xl text-gray-700 text-center mb-10">
        Aquí se mostrarán los gráficos y datos analíticos de las ventas.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">¡Contenido en Desarrollo!</h3>
        <p className="text-gray-600">
          Esta sección está siendo construida. Próximamente encontrarás aquí gráficos de ventas, productos más vendidos, y mucho más.
        </p>
        <div className="mt-6">
          {/* Aquí podrías añadir un spinner o un mensaje más visual */}
          <div className="animate-pulse text-blue-500 text-lg">Preparando tus datos...</div>
        </div>
      </div>

      {/* Aquí es donde iría la lógica y componentes para mostrar los reportes reales */}
    </div>
  );
};

export default AdminReportsPage;