import React from 'react';
import { Link } from 'react-router-dom';


interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  stock: number; 
}

const CartPage: React.FC = () => {
  // Datos de carrito simulados para el diseño
  // los datos vendrán de un estado global con Zustand
  const simulatedCartItems: CartItem[] = [
    {
      id: 'mock-1',
      name: 'Microcontrolador ESP32',
      price: 8.50,
      image_url: '',
      quantity: 2,
      stock: 10,
    },
    {
      id: 'mock-2',
      name: 'Sensor de Humedad DHT11',
      price: 2.75,
      image_url: '',
      quantity: 3,
      stock: 5,
    },
    {
      id: 'mock-3',
      name: 'Placa de Desarrollo Arduino UNO R3',
      price: 20.00,
      image_url: '',
      quantity: 1,
      stock: 0, // Simular un producto agotado para eliminar del carrito
    },
  ];

  // simulacion Calcular el subtotal y el total
  const subtotal = simulatedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 5.00 : 0; // Simulación de costo de envío
  const total = subtotal + shippingCost;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Tu Carrito de Compras</h1>
      {/* utilizamos un renderizado condicional para mostrar el contenido del carrito */}
      {simulatedCartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-600 mb-4">Tu carrito está vacío.</p>
          <Link
            to="/products"
            className="inline-block bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Explorar Productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Lista de Productos en el Carrito */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Artículos en tu Carrito</h2>
            {simulatedCartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                <img
                  src={item.image_url || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                {/** Información adicional del producto */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                  {item.stock === 0 && (
                    <p className="text-red-500 text-sm font-medium mt-1">
                      ¡Agotado! Por favor, elimina este artículo.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {/* Controles de cantidad (simulados) */}
                  <button
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors"
                    aria-label="Disminuir cantidad"
                    // onClick={() => handleDecreaseQuantity(item.id)} // una funcion para disminuir la cantidad mas adelante
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-6 text-center">{item.quantity}</span>
                  <button
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors"
                    aria-label="Aumentar cantidad"
                    // onClick={() => handleIncreaseQuantity(item.id)} // una funcion para aumentar la cantidad mas adelante
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 ml-6"
                  aria-label="Eliminar artículo"
                  // onClick={() => handleRemoveItem(item.id)} // una funcion para eliminar el item del carrito mas adelante
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {simulatedCartItems.some(item => item.stock === 0) && (
              <p className="text-red-600 mt-4 text-center font-semibold">
                Hay productos agotados en tu carrito. Por favor, elimínalos para continuar.
              </p>
            )}
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Resumen del Pedido</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4 border-b pb-4">
              <span>Costo de Envío:</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-xl mb-6">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={simulatedCartItems.some(item => item.stock === 0) || simulatedCartItems.length === 0}
              // onClick={() => handleCheckout()} // una funcion para proceder al pago mas adelante
            >
              Proceder al Pago
            </button>
            <Link
              to="/products"
              className="block text-center mt-4 text-blue-600 hover:underline transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;