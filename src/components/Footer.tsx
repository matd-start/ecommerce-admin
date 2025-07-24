import React from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';

const Footer: React.FC = () => {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <footer className="bg-gray-800 p-6 text-white mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sección 1: Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Makers Store</h3>
          <p className="text-sm text-gray-300">
            Tu tienda confiable de componentes electrónicos y microcontroladores.
          </p>
        </div>

        {/* Sección 2: Enlaces */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><Link to="/products" className="text-sm text-gray-300 hover:text-white">Productos</Link></li>
            {session && (
              <li><Link to="/profile" className="text-sm text-gray-300 hover:text-white">Mi Perfil</Link></li>
            )}
          </ul>
        </div>

        {/* Sección 3: Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contacto</h3>
          <p className="text-sm text-gray-300">contacto@makerstore.com</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Makers Store. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;