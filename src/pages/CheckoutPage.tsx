import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { supabase } from "../services/supabaseClient"; // Asegúrate de que esta importación sea correcta
import type { User } from "@supabase/supabase-js";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [address, setAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<User | null>(null); // Para almacenar el objeto de usuario de Supabase

  const shippingCost = totalAmount > 0 ? 5.0 : 0;
  const finalTotal = totalAmount + shippingCost;

  // Redirigir si el carrito está vacío o cargar datos del usuario
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
      return; // Salir temprano si el carrito está vacío
    }

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserSession(session.user);
        setUserName(session.user.user_metadata?.full_name || "");
        setUserEmail(session.user.email || "");
      } else {
        // Opcional: Si el usuario no está logueado, podrías forzarlo a loguearse
        // o permitirle continuar como invitado, pero los campos de email/nombre son obligatorios.
        setError("Debes iniciar sesión para completar la compra.");
      }
    };
    getSession();
  }, [items, navigate]);

  const validateForm = () => {
    console.log("Validando formulario...");
    console.log(
      "userName:",
      userName,
      "userEmail:",
      userEmail,
      "address:",
      address
    );
    console.log(
      "cardNumber:",
      cardNumber,
      "expiryDate:",
      expiryDate,
      "cvv:",
      cvv
    );

    if (
      !userName ||
      !userEmail ||
      !address ||
      !cardNumber ||
      !expiryDate ||
      !cvv
    ) {
      setError("Por favor, completa todos los campos.");
      console.log("Error: Campos incompletos.");
      return false;
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      setError("Número de tarjeta inválido (16 dígitos).");
      console.log("Error: Número de tarjeta inválido.");
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
      setError("Fecha de vencimiento inválida (MM/AA).");
      console.log("Error: Fecha de vencimiento inválida.");
      return false;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setError("CVV inválido (3 o 4 dígitos).");
      console.log("Error: CVV inválido.");
      return false;
    }
    setError(null);
    console.log("Formulario validado correctamente.");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Asegurarse de que el usuario esté logueado antes de intentar una compra
    if (!userSession) {
      setError("Debes iniciar sesión para completar la compra.");
      return;
    }
    const isValidForm = validateForm();
    if (!isValidForm) {
      //setError(error || 'Debes iniciar sesión para completar la compra o rellenar los campos completos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Simular un retraso en la red (proceso de pago simulado)
      console.log("Iniciando procesamiento de pago simulado...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera 2 segundos

      // 2. Registrar la Orden Principal en la tabla 'orders'
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userSession.id, // ID del usuario logueado, esencial para vincular la orden
          total_amount: finalTotal,
          shipping_address: address,
          customer_name: userName,
          customer_email: userEmail,
          status: "completed", // Estado inicial de la orden
        })
        .select() // Importante para obtener el ID de la orden recién creada
        .single(); // Para asegurar que obtenemos un solo objeto de retorno

      if (orderError || !orderData) {
        console.error("Error al crear la orden:", orderError?.message);
        throw new Error(
          "Error al registrar tu pedido principal. Inténtalo de nuevo."
        );
      }

      const orderId = orderData.id; // Obtenemos el ID de la orden generada por Supabase

      // 3. Registrar los Ítems de la Orden en la tabla 'order_items'
      const orderItemsToInsert = items.map((item) => ({
        order_id: orderId, // Vinculamos cada ítem al ID de la orden
        product_id: item.id,
        product_name: item.name, // Guardar el nombre actual del producto
        product_price: item.price, // Guardar el precio actual del producto al momento de la compra
        quantity: item.quantity,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert); // Insertamos todos los ítems del carrito de una vez

      if (orderItemsError) {
        console.error(
          "Error al crear los ítems de la orden:",
          orderItemsError.message
        );
        throw new Error(
          "Error al registrar los detalles de tu pedido. Por favor, contacta a soporte."
        );
      }

      // 4. Actualizar el Stock de los productos en la tabla 'products'
      // Esto reduce la cantidad disponible en la base de datos
      for (const item of items) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ stock: item.stock - item.quantity })
          .eq("id", item.id); // Busca el producto por su ID

        if (updateError) {
          console.error(
            `Error al actualizar stock para producto ${item.id}:`,
            updateError.message
          );
          // IMPORTANTE: En una app real, aquí manejarías una posible reversión de la orden
          // o marcarías la orden como "stock_issue" para revisión manual.
          throw new Error(
            "Error al actualizar el stock de algunos productos. Contacta a soporte."
          );
        }
      }

      // Si todo fue exitoso:
      clearCart(); // Vacía el carrito localmente y en localStorage
      navigate("/order-confirmation", {
        state: {
          orderId: orderId, // Pasamos el ID real de la orden para posible uso futuro
          total: finalTotal,
          items: items, // Pasamos los ítems para mostrar el resumen en la confirmación
        },
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Hubo un error inesperado al procesar tu pago. Inténtalo de nuevo.";
      setError(errorMessage);
      console.error("Error en el flujo de pago simulado:", err);
    } finally {
      setLoading(false); // Deshabilita el estado de carga
    }
  };

  // Esto es para manejar el caso donde el carrito esté vacío al cargar la página
  if (items.length === 0) {
    return null; // El useEffect ya se encargó de la redirección
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
        Finalizar Compra
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Detalles del Pedido */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Tu Pedido
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={
                      item.image_url ||
                      "https://via.placeholder.com/50x50?text=No+Image"
                    }
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(3)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(3)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Envío:</span>
              <span>${shippingCost.toFixed(3)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t mt-2">
              <span>Total Final:</span>
              <span>${finalTotal.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Formulario de Pago */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Detalles de Pago
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="userName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nombre Completo:
              </label>
              <input
                type="text"
                id="userName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="userEmail"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email:
              </label>
              <input
                type="email"
                id="userEmail"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Dirección de Envío:
              </label>
              <textarea
                id="address"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Número de Tarjeta:
              </label>
              <input
                type="text"
                id="cardNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={16}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label
                  htmlFor="expiryDate"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Fecha Vencimiento (MM/AA):
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="cvv"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  CVV:
                </label>
                <input
                  type="text"
                  id="cvv"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="XXX"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm italic mt-2 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-xl font-semibold hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading || items.length === 0 || !userSession} // Deshabilita si no hay usuario logueado
            >
              {loading
                ? "Procesando Pago..."
                : `Pagar Ahora $${finalTotal.toFixed(3)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
