/**
 * Helper para verificar permisos de edición
 * Los admins pueden editar cualquier contenido
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Verifica si el usuario actual es admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role_prf, is_active_prf')
      .eq('id_prf', userId)
      .single();

    if (error || !data) return false;

    return (
      (data as { role_prf: string; is_active_prf: boolean }).role_prf === 'admin' &&
      (data as { role_prf: string; is_active_prf: boolean }).is_active_prf === true
    );
  } catch (err) {
    console.error('[isUserAdmin] Error:', err);
    return false;
  }
}

/**
 * Verifica si el usuario puede editar el contenido
 * Retorna true si es el dueño O si es admin
 */
export async function canUserEdit(userId: string, ownerId: string | null): Promise<boolean> {
  // Si es el dueño, puede editar
  if (userId === ownerId) {
    return true;
  }

  // Si es admin, también puede editar
  return await isUserAdmin(userId);
}
