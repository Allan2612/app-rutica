import { supabase } from '@/lib/supabase/client';
import type { Profile, ProfileUpdate } from '@/types/entities';

/**
 * Obtiene el perfil del usuario actual
 */
export async function getCurrentProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id_prf, first_name_prf, last_name1_prf, last_name2_prf, phone_number_prf, role_prf, is_active_prf, created_at_prf, updated_at_prf')
    .eq('id_prf', userId)
    .single();

  if (error) throw error;
  
  // Mapear los nombres de columnas de la BD a los tipos TypeScript
  return {
    id_PRF: data.id_prf,
    first_name_PRF: data.first_name_prf,
    last_name1_PRF: data.last_name1_prf,
    last_name2_PRF: data.last_name2_prf,
    phone_number_PRF: data.phone_number_prf,
    role_PRF: data.role_prf,
    is_active_PRF: data.is_active_prf,
    created_at_PRF: data.created_at_prf,
    updated_at_PRF: data.updated_at_prf,
  } as Profile;
}

/**
 * Actualiza el perfil del usuario
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<Profile> {
  // Construir objeto de actualización solo con campos definidos
  const updateData: Record<string, unknown> = {
    updated_at_prf: new Date().toISOString(),
  };
  if (updates.first_name_PRF !== undefined) updateData.first_name_prf = updates.first_name_PRF;
  if (updates.last_name1_PRF !== undefined) updateData.last_name1_prf = updates.last_name1_PRF;
  if (updates.last_name2_PRF !== undefined) updateData.last_name2_prf = updates.last_name2_PRF;
  if (updates.phone_number_PRF !== undefined) updateData.phone_number_prf = updates.phone_number_PRF;

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id_prf', userId)
    .select('id_prf, first_name_prf, last_name1_prf, last_name2_prf, phone_number_prf, role_prf, is_active_prf, created_at_prf, updated_at_prf')
    .single();

  if (error) throw error;
  
  // Mapear los nombres de columnas de la BD a los tipos TypeScript
  return {
    id_PRF: data.id_prf,
    first_name_PRF: data.first_name_prf,
    last_name1_PRF: data.last_name1_prf,
    last_name2_PRF: data.last_name2_prf,
    phone_number_PRF: data.phone_number_prf,
    role_PRF: data.role_prf,
    is_active_PRF: data.is_active_prf,
    created_at_PRF: data.created_at_prf,
    updated_at_PRF: data.updated_at_prf,
  } as Profile;
}
