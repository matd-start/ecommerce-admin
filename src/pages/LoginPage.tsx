import React, { useState, useEffect } from 'react';
import LockIcon from '../components/LockIcon';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js'; // Importa el tipo User

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authOperationSuccessful, setAuthOperationSuccessful] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Si hay una sesión activa, obtener el rol del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error al obtener el perfil en LoginPage useEffect:', profileError.message);
          navigate('/products'); // Redirige a productos si no se puede obtener el rol
        } else if (profileData?.role === 'admin') {
          navigate('/admin/dashboard'); // Redirige a dashboard de admin
        } else {
          navigate('/products'); // Redirige a productos para clientes
        }
      }
    };
    checkSessionAndRedirect();
  }, [navigate]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setAuthOperationSuccessful(false);

    let authResponse: { data: { user: User | null; session: import('@supabase/supabase-js').Session | null; }; error: Error | null; };

    if (isLoginView) {
      // Lógica de INICIO DE SESIÓN
      authResponse = await supabase.auth.signInWithPassword({ email, password });
      
      if (authResponse.error) {
        setError(authResponse.error.message);
      } else {
        // Inicio de sesión exitoso, ahora obtener el rol para la redirección
        if (authResponse.data.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', authResponse.data.user.id)
            .single();

          if (profileError) {
            console.error('Error al obtener el perfil después de login:', profileError.message);
            setError('Inicio de sesión exitoso, pero hubo un problema al obtener tu rol.');
            // Aún así, podemos redirigir al lugar por defecto o pedir reintentar
            setAuthOperationSuccessful(true);
            setMessage('Inicio de sesión exitoso. Redireccionando...');
            setTimeout(() => navigate('/products'), 1500);
          } else if (profileData?.role === 'admin') {
            setAuthOperationSuccessful(true);
            setMessage('Inicio de sesión exitoso como administrador. Redireccionando...');
            setTimeout(() => navigate('/admin/dashboard'), 1500); // Redirige a admin
          } else {
            setAuthOperationSuccessful(true);
            setMessage('Inicio de sesión exitoso. Redireccionando...');
            setTimeout(() => navigate('/products'), 1500); // Redirige a productos para clientes
          }
        } else {
            // Esto es un caso raro, pero si signInWithPassword no devuelve user pero tampoco error
            setError('Inicio de sesión incompleto. Inténtalo de nuevo.');
        }
      }

    } else {
      // Lógica de REGISTRO (sin cambios en esta sección del código)
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        setLoading(false);
        return;
      }

      authResponse = await supabase.auth.signUp({ email, password });

      if (authResponse.error) {
        setError(authResponse.error.message);
        console.error('Error al registrarse en Auth:', authResponse.error);
      } else if (authResponse.data.user) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: authResponse.data.user.id,
                role: 'client',
                email: authResponse.data.user.email,
              },
            ]);

          if (profileError) {
            console.error('Error al insertar el perfil del usuario:', profileError);
            setError('Registro exitoso, pero hubo un problema al guardar tu información de perfil. Por favor, contacta a soporte.');
          } else {
            setAuthOperationSuccessful(true);
            setMessage('Registro exitoso. ¡Por favor, revisa tu correo electrónico para confirmar tu cuenta!');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }
        } catch (insertError) {
          console.error('Error inesperado al insertar perfil:', insertError);
          setError('Ocurrió un error inesperado durante el registro del perfil.');
        }
      } else if (authResponse.data.session === null && authResponse.data.user === null) {
        setAuthOperationSuccessful(true);
        setMessage('Registro exitoso. Se ha enviado un correo de confirmación. Por favor, revisa tu bandeja de entrada.');
      } else {
        setError('Ocurrió un error desconocido durante el registro.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-12 min-h-[calc(100vh-160px)] bg-gray-50">
      <div className="relative w-full max-w-4xl min-h-[400px] h-auto md:h-[450px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        <div
          className={`relative w-full md:w-1/2 mb-8 md:mb-0 flex flex-col justify-center p-8 md:p-12 transition-transform duration-700 ease-in-out
            ${authOperationSuccessful ? "-translate-x-full md:!translate-x-0" : "translate-x-0"}`}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <form onSubmit={handleAuthAction} className="flex flex-col">
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLoginView ? "current-password" : "new-password"}
              required
            />
            {!isLoginView && (
              <input
                type="password"
                placeholder="Confirmar Contraseña"
                className="mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (isLoginView ? 'Iniciando...' : 'Registrando...') : (isLoginView ? 'Iniciar Sesión' : 'Registrarse')}
            </button>

            <p className="mt-6 text-center text-gray-600">
              {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setError(null);
                  setMessage(null);
                  setAuthOperationSuccessful(false);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 hover:underline ml-2 font-medium"
              >
                {isLoginView ? 'Regístrate aquí' : 'Iniciar Sesión'}
              </button>
            </p>
          </form>
        </div>

        <div
          className="w-full md:w-1/2 h-full bg-blue-700 flex flex-col items-center justify-center p-8 md:p-12 text-white text-center transition-transform duration-700 ease-in-out"
        >
          {authOperationSuccessful ? (
            <>
              <h3 className="text-4xl font-extrabold mb-4">¡Acceso Concedido!</h3>
              <p className="text-xl opacity-90 mb-6">Redireccionando...</p>
              <LockIcon isOpen={true} />
            </>
          ) : (
            <>
              <LockIcon isOpen={false} />
              <h3 className="text-4xl font-extrabold mt-6 mb-3">Seguro y Simple</h3>
              <p className="text-lg opacity-90">
                Al registrarse optimizamos tu experiencia, guardamos tus datos y preferencias para futuras compras.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
