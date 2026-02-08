import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import type { UserRole } from '@/types/enums';
import type { User } from '@supabase/supabase-js';

/**
 * Estado de autenticación
 */
interface AuthState {
  user: User | null;
  role: UserRole | null;
  profileName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _initialized: boolean;
  _isLoadingData: boolean; // Flag interno para evitar cargas simultáneas
  _isRecoveryMode: boolean; // Flag para modo de recuperación de contraseña
}

/**
 * Acciones del store de autenticación
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  setLoading: (isLoading: boolean) => void;
  setRecoveryMode: (isRecovery: boolean) => void;
  loadUserData: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
  cleanup: () => void;
  resetLoadingFlag: () => void;
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
  profileName: null,
  isLoading: true,
  isAuthenticated: false,
  _initialized: false,
  _isLoadingData: false,
  _isRecoveryMode: false,

  // Acciones
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setRole: (role) => set({ role }),

  setLoading: (isLoading) => set({ isLoading }),

  setRecoveryMode: (isRecovery) => set({ _isRecoveryMode: isRecovery }),

  /**
   * Carga los datos del usuario autenticado y su perfil
   */
  loadUserData: async () => {
    const state = get();
    
    // NO cargar datos si estamos en modo recovery (recuperación de contraseña)
    if (state._isRecoveryMode) {
      set({ isLoading: false, _isLoadingData: false });
      return;
    }
    
    // Evitar cargas múltiples simultáneas
    if (state._isLoadingData) {
      return;
    }

    // Solo mostrar spinner si es la primera carga (no hay usuario)
    const showSpinner = !state.user;
    set({ isLoading: showSpinner, _isLoadingData: true });

    try {
      // 1. Verificar si hay una sesión válida
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // Si hay error de refresh token, limpiar todo
      if (sessionError) {
        if (sessionError.message?.includes('Invalid Refresh Token') || 
            sessionError.message?.includes('Refresh Token Not Found')) {
          console.warn('[AUTH] Token inválido detectado, limpiando sesión...');
          await supabase.auth.signOut();
        }
        set({
          user: null,
          role: null,
          profileName: null,
          isAuthenticated: false,
          isLoading: false,
          _isLoadingData: false,
        });
        return;
      }

      if (!session) {
        set({
          user: null,
          role: null,
          profileName: null,
          isAuthenticated: false,
          isLoading: false,
          _isLoadingData: false,
        });
        return;
      }

      // 2. Usar el usuario de la sesión directamente (más confiable)
      const authUser = session.user;

      if (!authUser) {
        set({
          user: null,
          role: null,
          profileName: null,
          isAuthenticated: false,
          isLoading: false,
          _isLoadingData: false,
        });
        return;
      }

      // 3. Obtener perfil con rol
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_prf, first_name_prf, last_name1_prf')
        .eq('id_prf', authUser.id)
        .single<{ role_prf: UserRole; first_name_prf: string | null; last_name1_prf: string | null }>();

      if (profileError) {
        // Si el perfil no existe, desloguear
        if (profileError.code === 'PGRST116') {
          set({ _isLoadingData: false });
          await get().signOut();
          return;
        }
        
        // Otros errores: mantener sesión sin rol
        set({
          user: authUser,
          role: null,
          profileName: null,
          isAuthenticated: true,
          isLoading: false,
          _isLoadingData: false,
        });
      } else {
        // Carga exitosa
        const nameParts = [profile?.first_name_prf, profile?.last_name1_prf].filter(Boolean);
        const profileName = nameParts.length > 0 ? nameParts.join(' ') : null;

        set({
          user: authUser,
          role: profile?.role_prf ?? null,
          profileName,
          isAuthenticated: true,
          isLoading: false,
          _isLoadingData: false,
        });
      }
    } catch (error: any) {
      console.error('[AUTH] Error cargando datos de usuario:', error);
      
      // Si es error de refresh token, limpiar almacenamiento
      if (error?.message?.includes('Invalid Refresh Token') || 
          error?.message?.includes('Refresh Token Not Found')) {
        console.warn('[AUTH] Limpiando sesión corrupta...');
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.error('[AUTH] Error al hacer signOut:', signOutError);
        }
      }
      
      // IMPORTANTE: Siempre resetear el flag en caso de error
      set({
        user: null,
        role: null,
        profileName: null,
        isAuthenticated: false,
        isLoading: false,
        _isLoadingData: false,
      });
    }
  },

  /**
   * Cierra sesión y limpia el estado
   */
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        role: null,
        profileName: null,
        isAuthenticated: false,
        isLoading: false,
        _isLoadingData: false,
      });
    } catch (error) {
      // Limpiar estado local de todos modos
      set({
        user: null,
        role: null,
        profileName: null,
        isAuthenticated: false,
        isLoading: false,
        _isLoadingData: false,
      });
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
      return;
    }
    set({ _initialized: true });

    // Registrar listener antes de cargar datos (evita race conditions)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Manejar recuperación de contraseña - NO autenticar al usuario
        if (event === 'PASSWORD_RECOVERY') {
          set({
            _isRecoveryMode: true,
            isLoading: false,
            _isLoadingData: false,
          });
          return;
        }
        
        if (event === 'SIGNED_OUT') {
          set({
            user: null,
            role: null,
            profileName: null,
            isAuthenticated: false,
            isLoading: false,
            _isLoadingData: false,
            _isRecoveryMode: false,
          });
        } else if (event === 'INITIAL_SESSION' && !session) {
          // Si no hay sesión inicial, asegurarse de limpiar el estado
          set({
            user: null,
            role: null,
            profileName: null,
            isAuthenticated: false,
            isLoading: false,
            _isLoadingData: false,
          });
        } else if (event === 'SIGNED_IN') {
          // NO cargar datos si estamos en modo recovery
          const currentState = get();
          if (currentState._isRecoveryMode) {
            set({ isLoading: false, _isLoadingData: false });
            return;
          }
          // Solo cargar si NO tenemos usuario ya cargado
          if (!currentState.user) {
            await get().loadUserData();
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // NO cargar datos si estamos en modo recovery
          const currentState = get();
          if (currentState._isRecoveryMode) {
            return;
          }
          // Solo refrescar si el usuario cambió, no mostrar spinner
          if (session?.user?.id && session.user.id !== currentState.user?.id) {
            await get().loadUserData();
          }
          // Si es el mismo usuario, solo actualizar el objeto user sin recargar todo
          else if (session?.user && currentState.user) {
            set({ user: session.user });
          }
        } else if (event === 'USER_UPDATED') {
          // Si estamos en modo recovery y se actualizó el usuario (contraseña cambiada),
          // no recargar datos - la pantalla de reset se encargará
          const currentState = get();
          if (currentState._isRecoveryMode) {
            return;
          }
          // Solo recargar si hay cambios reales en el usuario
          if (session?.user && JSON.stringify(session.user) !== JSON.stringify(currentState.user)) {
            await get().loadUserData();
          }
        } else if (event === 'INITIAL_SESSION') {
          // Este evento ocurre al iniciar - cargar datos del usuario
          // NO cargar si estamos en modo recovery
          const currentState = get();
          if (currentState._isRecoveryMode) {
            set({ isLoading: false, _isLoadingData: false });
            return;
          }
          if (session?.user) {
            await get().loadUserData();
          }
        }
      }
    );

    (get() as any)._subscription = subscription;
    
    // Cargar datos inicialmente
    get().loadUserData();
  },

  /**
   * Resetea el flag de carga si se queda atorado
   */
  resetLoadingFlag: () => {
    const state = get();
    if (state._isLoadingData) {
      set({ _isLoadingData: false, isLoading: false });
    }
  },

  /**
   * Limpia el listener al desmontar
   */
  cleanup: () => {
    const subscription = (get() as any)._subscription;
    if (subscription) {
      subscription.unsubscribe();
      delete (get() as any)._subscription;
    }
    set({ _initialized: false, _isLoadingData: false, _isRecoveryMode: false });
  },
}));
