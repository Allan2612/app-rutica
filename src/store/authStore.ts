import { create } from 'zustand';
import { supabase } from '../lib/supabase/client';
import type { UserRole } from '../types/enums';
import type { User } from '@supabase/supabase-js';

/**
 * Estado de autenticación
 */
interface AuthState {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _initialized: boolean;
}

/**
 * Acciones del store de autenticación
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (isLoading: boolean) => void;
  loadUserData: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
  cleanup: () => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * Store global de autenticación usando Zustand
 * 
 * @example
 * ```tsx
 * import { useAuthStore } from '@/store';
 * 
 * function MyComponent() {
 *   const { user, role, isAuthenticated, isLoading } = useAuthStore();
 *   const { signOut, loadUserData } = useAuthStore();
 *   
 *   if (isLoading) return <Loader />;
 *   if (!isAuthenticated) return <Login />;
 *   
 *   return <div>Hola {user.email}</div>;
 * }
 * ```
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Estado inicial
  user: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
  _initialized: false,

  // Acciones
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setRole: (role) => set({ role }),

  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Carga los datos del usuario autenticado y su perfil
   */
  loadUserData: async () => {
    const state = get();
    // Evitar cargas múltiples simultáneas
    if (state.isLoading && state._initialized) {
      console.log('[AUTH STORE] Ya hay una carga en proceso, saltando...');
      return;
    }

    // Timeout de seguridad (10 segundos)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout al cargar usuario')), 10000)
    );

    try {
      console.log('[AUTH STORE] Cargando datos del usuario...');
      set({ isLoading: true });

      // 1. Obtener usuario autenticado con timeout
      const { data: { user: authUser }, error: authError } = await Promise.race([
        supabase.auth.getUser(),
        timeoutPromise
      ]);

      if (authError || !authUser) {
        console.log('[AUTH STORE] No hay usuario autenticado', authError?.message || '');
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      console.log('[AUTH STORE] Usuario obtenido:', authUser.email);

      // 2. Obtener perfil con rol (con timeout)
      const { data: profile, error: profileError } = await Promise.race([
        supabase
          .from('profiles')
          .select('role_prf')
          .eq('id_prf', authUser.id)
          .single(),
        timeoutPromise
      ]);

      if (profileError) {
        console.error('[AUTH STORE] Error cargando perfil:', profileError.message);
        set({
          user: authUser,
          role: null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('[AUTH STORE] Usuario y perfil cargados:', {
          email: authUser.email,
          role: profile?.role_prf,
        });
        set({
          user: authUser,
          role: profile?.role_prf ?? null,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.error('[AUTH STORE] Error crítico:', error?.message || error);
      // IMPORTANTE: Siempre poner isLoading en false
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Cierra sesión y limpia el estado
   */
  signOut: async () => {
    try {
      console.log('[AUTH STORE] Cerrando sesión...');
      await supabase.auth.signOut();
      set({
        user: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
      console.log('[AUTH STORE] Sesión cerrada');
    } catch (error) {
      console.error('[AUTH STORE] Error al cerrar sesión:', error);
    }
  },

  /**
   * Inicializa el listener de cambios de autenticación
   * Debe llamarse en el root de la app
   */
  initialize: () => {
    const state = get();
    
    // Evitar múltiples inicializaciones
    if (state._initialized) {
      console.log('[AUTH STORE] Ya está inicializado, saltando...');
      return;
    }

    console.log('[AUTH STORE] Inicializando...');
    set({ _initialized: true });

    // Carga inicial
    get().loadUserData();

    // Listener de cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH STORE] Auth change:', event);

        if (event === 'SIGNED_OUT') {
          set({
            user: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Evitar cargas redundantes
          const currentState = get();
          if (session?.user?.id !== currentState.user?.id) {
            await get().loadUserData();
          }
        } else if (event === 'USER_UPDATED') {
          await get().loadUserData();
        }
      }
    );

    // Guardar subscription para cleanup
    (get() as any)._subscription = subscription;
  },

  /**
   * Limpia el listener al desmontar
   */
  cleanup: () => {
    const subscription = (get() as any)._subscription;
    if (subscription) {
      console.log('[AUTH STORE] Limpiando subscription...');
      subscription.unsubscribe();
      delete (get() as any)._subscription;
    }
    set({ _initialized: false });
  },
}));
