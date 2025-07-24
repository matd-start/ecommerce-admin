import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number; // <--- ¡NUEVA PROPIEDAD!
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  // Nueva acción para recalcular el total por si acaso, aunque se hará automáticamente
  // recalculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0, // <--- Inicializamos en 0

      addItem: (product) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === product.id
          );

          if (existingItemIndex > -1) {
            // Producto ya en el carrito, actualiza la cantidad si hay stock
            const updatedItems = state.items.map((item, index) =>
              index === existingItemIndex && item.quantity < product.stock
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return { items: updatedItems, totalItems: newTotalItems, totalAmount: newTotalAmount };
          } else {
            // Producto no en el carrito, añade si hay stock
            if (product.stock > 0) {
              const newItems = [...state.items, { ...product, quantity: 1 }];
              const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
              const newTotalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

              return { items: newItems, totalItems: newTotalItems, totalAmount: newTotalAmount };
            }
            return state; // No añade si no hay stock inicial
          }
        }),

      removeItem: (productId) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== productId);
          const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return { items: updatedItems, totalItems: newTotalItems, totalAmount: newTotalAmount };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) } // Asegura qty >= 1 y no > stock
              : item
          );
          const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const newTotalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return { items: updatedItems, totalItems: newTotalItems, totalAmount: newTotalAmount };
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalAmount: 0 }), // <--- Limpiamos también el totalAmount
    }),
    {
      name: 'cart-storage', // Nombre para el almacenamiento local
      storage: createJSONStorage(() => localStorage),
    }
  )
);