import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  user_id: string;
  role: 'client' | 'admin';
  email: string;
}

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // estado para almacenar el ID del usuario actual
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRoleAndFetchUsers = async () => {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        console.error('AdminUserManagement: No hay sesión o error al obtenerla.', sessionError?.message);
        navigate('/login', { replace: true });
        return;
      }

      //Guardamos el ID del usuario actual
      setCurrentUserId(session.user.id);

      // Verificar si el usuario actual es administrador
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profileData || profileData.role !== 'admin') {
        console.warn('AdminUserManagement: Acceso denegado.', profileError?.message);
        alert('Acceso denegado: No tienes permisos de administrador para gestionar usuarios.');
        navigate('/products', { replace: true });
        return;
      }

      try {
        const { data: userProfiles, error: fetchError } = await supabase
          .from('user_profiles')
          .select('user_id, role, email');

        if (fetchError) {
          throw fetchError;
        }

        const userIds = userProfiles.map(p => p.user_id);
        console.log('AdminUserManagement: User IDs fetched:', userIds);
        ////supabase.auth.admin.listUsers() (y otras funciones admin) está diseñada para ser llamada con una Service Role Key que no usamos en este momento por eso omitimos
        //const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();
                    
       // if (authUsersError) {
       //   console.warn('Could not fetch auth users emails:', authUsersError.message);
       // }

        const fullUsers: UserProfile[] = userProfiles.map(profile => {
          //const authUser = authUsersData?.users.find(u => u.id === profile.user_id);
          return {
            user_id: profile.user_id,
            role: profile.role as 'client' | 'admin',
            email: profile.email || 'Email no disponible',
          };
        });

        setUsers(fullUsers);

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error fetching user profiles:', errorMessage);
        setError('Error al cargar la lista de usuarios: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRoleAndFetchUsers();
  }, [navigate]);

  const handleRoleChange = async (userId: string, newRole: 'client' | 'admin') => {
    if (!window.confirm(`¿Estás seguro de que quieres cambiar el rol del usuario ${userId} a ${newRole}?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId ? { ...user, role: newRole } : user
        )
      );
      alert(`Rol del usuario ${userId} actualizado a ${newRole} exitosamente.`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error updating user role:', errorMessage);
      setError('Error al actualizar el rol: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-xl text-gray-600">Cargando gestión de usuarios...</p>;
  }

  if (error) {
    return <p className="text-center py-20 text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Gestión de Usuarios</h1>
      <p className="text-xl text-gray-700 text-center mb-10">
        Gestiona los roles de todos los usuarios de tu tienda.
      </p>

      {users.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">ID de Usuario</th>
                <th className="py-3 px-6 text-left">Rol</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {users.map((user) => (
                <tr key={user.user_id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left break-all">{user.user_id}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      {user.role === 'client' ? (
                        <button 
                          onClick={() => handleRoleChange(user.user_id, 'admin')} 
                          className="bg-purple-500 text-white py-1 px-3 rounded-md hover:bg-purple-600 transition-colors duration-200 text-xs"
                          disabled={loading}
                        >
                          Hacer Admin
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRoleChange(user.user_id, 'client')} 
                          className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 transition-colors duration-200 text-xs"
                          disabled={loading || user.user_id === currentUserId} // Deshabilitar si es el usuario actual
                        >
                          Hacer Cliente
                        </button>
                      )}
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

export default AdminUserManagementPage;
