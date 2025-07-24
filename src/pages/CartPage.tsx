import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import type { CartItem } from '../store/cartStore';

const CartPage: React.FC = () => {
  // Obtener cada pieza del estado del store con selectores individuales
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Calcular totalItems y totalAmount directamente en el componente
  // Esto es eficiente ya que 'items' solo cambia si se añaden/eliminan/actualizan elementos
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shippingCost = totalAmount > 0 ? 5.00 : 0;
  const finalTotal = totalAmount + shippingCost;

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    const quantityToUpdate = Math.min(Math.max(1, newQuantity), item.stock);
    updateQuantity(item.id, quantityToUpdate);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const hasOutOfStockItems = items.some(item => item.stock <= 0 || item.quantity > item.stock);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-160px)]">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Tu Carrito de Compras</h1>

      {items.length === 0 ? (
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Artículos en tu Carrito ({totalItems})</h2>
            {items.map((item) => (
              <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                <img
                  src={item.image_url || 'https://via.placeholder.com/80x80?text=No+Image'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">
                    ${item.price.toFixed(3)}
                  </p>
                  {(item.stock <= 0 || item.quantity > item.stock) && (
                    <p className="text-red-500 text-sm font-medium mt-1">
                      {item.stock <= 0 ? '¡Agotado!' : `Solo quedan ${item.stock} unidades.`} Por favor, ajusta la cantidad.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Disminuir cantidad"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
                    className="text-lg font-medium w-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Aumentar cantidad"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 ml-6"
                  aria-label="Eliminar artículo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {hasOutOfStockItems && (
              <p className="text-red-600 mt-4 text-center font-semibold">
                Hay productos con cantidad incorrecta o agotados en tu carrito. Por favor, ajústalos.
              </p>
            )}
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Resumen del Pedido</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}):</span>
              <span>${totalAmount.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4 border-b pb-4">
              <span>Costo de Envío:</span>
              <span>${shippingCost.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-xl mb-6">
              <span>Total:</span>
              <span>${finalTotal.toFixed(3)}</span>
            </div>
            {hasOutOfStockItems || items.length === 0 ? (
              <span
                className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg text-xl font-semibold cursor-not-allowed block text-center"
                aria-disabled="true"
              >
                Proceder al Pago
              </span>
            ) : (
              <Link
                to="/checkout"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-300 block text-center"
              >
                Proceder al Pago
              </Link>
            )}
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