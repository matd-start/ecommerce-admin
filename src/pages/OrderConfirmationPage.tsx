import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { CartItem } from '../store/cartStore'; // Reutilizamos la interfaz CartItem

// Definimos una interfaz para el estado que recibimos de la navegación
interface LocationState {
  orderId?: string; // Ahora pasamos el ID de la orden
  total?: number;
  items?: CartItem[];
}

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null); // Nuevo estado para orderId

  useEffect(() => {
    // Recuperar los datos pasados a través de la navegación
    const state = location.state as LocationState;
    if (state && state.total && state.items) {
      setOrderTotal(state.total);
      setOrderItems(state.items);
      setOrderId(state.orderId || null); // Guardar el orderId si viene
    } else {
      // Si no hay datos (ej. recarga de página), mostramos un mensaje genérico.
      // En una aplicación real, se buscarían los detalles de la orden por un ID de URL
      setOrderTotal(0);
      setOrderItems([]);
      setOrderId(null);
    }
  }, [location.state]); // Dependencia en location.state para reaccionar a cambios de navegación

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center min-h-[calc(100vh-160px)] flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <svg
          className="mx-auto h-24 w-24 text-green-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Gracias por tu compra!</h1>
        <p className="text-xl text-gray-600 mb-8">Tu pedido ha sido procesado con éxito.</p>

        {orderId && ( // Muestra el ID de la orden si está disponible
          <p className="text-lg text-gray-700 mb-4">Número de Pedido: <span className="font-mono bg-gray-100 p-1 rounded">{orderId}</span></p>
        )}

        {orderTotal !== null && orderItems.length > 0 ? (
          <>
            <div className="text-left mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Resumen del Pedido:</h2>
              <ul className="space-y-2 mb-4">
                {orderItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center text-lg text-gray-700 border-b border-gray-100 pb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(3)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 pt-4 border-t border-gray-300">
                <span>Total Pagado:</span>
                <span>${orderTotal.toFixed(3)}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-500 mb-6">No se pudo cargar el resumen del pedido. Si crees que hay un error, contacta a soporte.</p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/products"
            className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
          >
            Continuar Comprando
          </Link>
          <Link
            to="/orders" // Esto podría llevar a una futura página de "Mis Pedidos"
            className="border border-blue-600 text-blue-600 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105"
          >
            Ver Historial de Pedidos (futuro)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;