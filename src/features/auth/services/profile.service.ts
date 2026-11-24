import { supabase } from '@/lib/supabase/client';
import type { Profile, ProfileUpdate } from '@/types/entities';

// Columnas de profiles que anon y authenticated pueden leer (migración 2026-10-15_auditoria, sección 6).
// El perfil propio completo (con teléfono) sale de la RPC get_my_profile (authStore).
const PUBLIC_PROFILE_COLUMNS =
  'id_prf, first_name_prf, last_name1_prf, last_name2_prf, role_prf, is_active_prf, profile_photo_path_prf, created_at_prf, updated_at_prf';

/**
 * Obtiene un perfil por su ID (solo columnas públicas)
 */
export async function getProfileById(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PUBLIC_PROFILE_COLUMNS)
    .eq('id_prf', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Actualiza el perfil de un usuario (RLS: solo el propio; rol y estado los protege la BD)
 */
export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at_prf: new Date().toISOString(),
    } as never)
    .eq('id_prf', userId);

  if (error) throw error;
}
