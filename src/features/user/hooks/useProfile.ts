import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../../../store';
import { getCurrentProfile, updateUserProfile } from '../services';
import type { Profile, ProfileUpdate } from '../../../types/entities';

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/**
 * Hook para manejar el perfil del usuario
 */
export function useProfile(): UseProfileReturn {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCurrentProfile(user.id);
      setProfile(data);
    } catch (err: any) {
      console.error('[useProfile] Error al cargar perfil:', err);
      setError(err.message || 'Error al cargar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const updateProfile = useCallback(
    async (updates: ProfileUpdate) => {
      if (!user?.id) {
        throw new Error('No hay usuario autenticado');
      }

      try {
        setIsLoading(true);
        setError(null);
        const updatedProfile = await updateUserProfile(user.id, updates);
        setProfile(updatedProfile);
      } catch (err: any) {
        console.error('[useProfile] Error al actualizar perfil:', err);
        setError(err.message || 'Error al actualizar perfil');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile,
  };
}
