import { supabase } from '@/lib/supabase/client';
import type { Profile, ProfileUpdate } from '@/types/entities';

/**
 * Obtiene el perfil del usuario actual
 */
export async function getCurrentProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id_prf', userId).single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateUserProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at_prf: new Date().toISOString(),
    } as never)
    .eq('id_prf', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Convierte un usuario buyer a seller
 */
export async function upgradeToSeller(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      role_prf: 'seller',
      updated_at_prf: new Date().toISOString(),
    } as never)
    .eq('id_prf', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}
