import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';
import type { UserRole } from '../types/enums';
import type { User } from '@supabase/supabase-js';

interface AuthUser {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook global para manejar el estado de autenticación del usuario
 * Incluye información del perfil (rol)
 */
export function useAuthUser(): AuthUser {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      // 1. Obtener usuario autenticado
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        setUser(null);
        setRole(null);
        setIsLoading(false);
        return;
      }

      setUser(authUser);

      // 2. Obtener perfil con rol
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role_prf')
        .eq('id_prf', authUser.id)
        .single();

      if (profileError) {
        console.error('[AUTH USER] Error cargando perfil:', profileError);
        setRole(null);
      } else {
        setRole(profile?.role_prf ?? null);
        console.log('[AUTH USER] Rol cargado:', profile?.role_prf);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('[AUTH USER] Error:', error);
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial
    loadUserData();

    // Listener de cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH USER] Auth change:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
          setIsLoading(false);
        } else if (session?.user) {
          await loadUserData();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  return {
    user,
    role,
    isLoading,
    isAuthenticated: !!user,
    refresh: loadUserData,
  };
}
