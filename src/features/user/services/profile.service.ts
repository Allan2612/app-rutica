import { supabase } from '@/lib/supabase/client';
import type { Profile, ProfileUpdate } from '@/types/entities';

/**
 * Obtiene el perfil completo del usuario actual.
 * La tabla profiles solo expone columnas públicas (S-05): el perfil propio completo
 * (teléfono incluido) se lee con la RPC get_my_profile.
 */
export async function getCurrentProfile(_userId?: string): Promise<Profile> {
  const { data, error } = await supabase.rpc('get_my_profile').single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateUserProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at_prf: new Date().toISOString(),
    } as never)
    .eq('id_prf', userId);

  if (error) throw error;
  return getCurrentProfile();
}

/**
 * Convierte un usuario buyer a seller
 */
export async function upgradeToSeller(userId: string): Promise<Profile> {
  const { error } = await supabase
    .from('profiles')
    .update({
      role_prf: 'seller',
      updated_at_prf: new Date().toISOString(),
    } as never)
    .eq('id_prf', userId);

  if (error) throw error;
  return getCurrentProfile();
}
