import { useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import type { User } from "@supabase/supabase-js";

export const useSessionSync = (
  user: User | null,
  setUser: (u: User | null) => void,
  setUserRole: (r: "client" | "admin" | null) => void,
  setLoading?: (b: boolean) => void
) => {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  const cleanSupabaseTokens = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
        console.warn(`useSessionSync - Eliminando token de sesión: ${key}`);
        localStorage.removeItem(key);
      }
    });
  };

  // 🧩 Obtiene la sesión inicial y actualiza el usuario
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("useSessionSync - Error al obtener sesión:", error);
        return;
      }

      if (!session?.user) {
        console.log("useSessionSync - No hay sesión válida. Limpiando...");
        setUser(null);
        setUserRole(null);
        clearCart();
        cleanSupabaseTokens();
        setLoading?.(false);
        navigate("/login");
        return;
      }

      setUser(session.user);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("useSessionSync - Cambio de sesión:", _event);
      if (session?.user) {
        setUser(session.user);
      } else {
        console.log("useSessionSync - Usuario deslogueado. Limpiando estado.");
        setUser(null);
        setUserRole(null);
        clearCart();
        cleanSupabaseTokens();
        setLoading?.(false);
        navigate("/login");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 🧠 Obtiene el rol cuando cambia el usuario
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("useSessionSync - Error al obtener rol:", error.message);
        setUserRole(null);
      } else {
        console.log("useSessionSync - Rol del usuario obtenido:", profileData?.role);
        setUserRole(profileData?.role || null);
      }
    };

    fetchUserRole();
  }, [user]);
};
