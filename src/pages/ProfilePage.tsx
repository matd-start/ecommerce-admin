import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Importa el cliente Supabase
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  type UserType = {
    id: string;
    email?: string;
    created_at: string;
    user_metadata?: {
      full_name?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Error al obtener el usuario:', error?.message);
        setError('No se pudo cargar la información del perfil. Por favor, intenta iniciar sesión de nuevo.');
        setLoading(false);
        navigate('/login'); // Redirige al login si no hay usuario o hay error
      } else {
        // Map Supabase user to UserType
        const mappedUser: UserType = {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          user_metadata: user.user_metadata,
        };
        setUser(mappedUser);
        setLoading(false);
      }
    };

    fetchUser();

    // Escuchar cambios de autenticación para actualizar la interfaz
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mappedUser: UserType = {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at,
          user_metadata: session.user.user_metadata,
        };
        setUser(mappedUser);
      } else {
        setUser(null);
        navigate('/login'); // Redirige si la sesión termina
      }
    });
    subscription = data?.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100">
        <p className="text-xl text-gray-700">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link to="/login" className="text-blue-600 hover:underline">Ir a Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // El useEffect ya redirigió si no hay usuario
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Mi Perfil</h2>
        <div className="space-y-4 text-gray-700">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Nombre:</strong> {user.user_metadata?.full_name || 'No especificado'}</p>
          <p><strong>ID de Usuario:</strong> {user.id}</p>
          <p><strong>Fecha de Creación:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          {/* Puedes añadir más detalles del perfil aquí */}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/orders" // Futura página para ver las órdenes del usuario
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Ver Mis Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;