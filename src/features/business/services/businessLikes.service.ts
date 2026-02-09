import { supabase } from '@/lib/supabase/client';
import { Platform } from 'react-native';
import type { BusinessLike } from '@/types/entities';

/**
 * Obtiene los IDs de negocios que el usuario tiene como favoritos
 */
export async function getUserFavoriteBusinessIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('business_likes')
    .select('business_id_blk')
    .eq('user_id_blk', userId)
    .returns<Pick<BusinessLike, 'business_id_blk'>[]>();

  if (error) {
    console.error('[businessLikes] Error fetching favorites:', error.message);
    return [];
  }

  return data?.map((like) => like.business_id_blk) ?? [];
}

/**
 * Verifica si un negocio está marcado como favorito
 */
export async function isBusinessFavorite(businessId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('business_likes')
    .select('business_id_blk')
    .eq('business_id_blk', businessId)
    .eq('user_id_blk', userId)
    .maybeSingle();

  if (error) {
    console.error('[businessLikes] Error checking favorite:', error.message);
    return false;
  }

  return !!data;
}

/**
 * Agrega un negocio a favoritos
 */
export async function addBusinessToFavorites(businessId: string, userId: string): Promise<boolean> {
  const { error } = await supabase.from('business_likes').insert({
    business_id_blk: businessId,
    user_id_blk: userId,
  } as any);

  if (error) {
    // Si ya existe, no es un error crítico
    if (error.code === '23505') {
      // Aunque ya existe, registramos la interacción
      await registerBusinessInteraction(businessId, userId); // Usando como proxy de "like"
      return true;
    }
    console.error('[businessLikes] Error adding favorite:', error.message);
    return false;
  }

  // Registrar interacción de "like" (usando share_click como proxy hasta actualizar el enum)
  await registerBusinessInteraction(businessId, userId);

  return true;
}

/**
 * Elimina un negocio de favoritos
 */
export async function removeBusinessFromFavorites(
  businessId: string,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('business_likes')
    .delete()
    .eq('business_id_blk', businessId)
    .eq('user_id_blk', userId);

  if (error) {
    console.error('[businessLikes] Error removing favorite:', error.message);
    return false;
  }

  // Registrar interacción de "unlike" (usando contact_click como proxy hasta actualizar el enum)
  await registerBusinessInteraction(businessId, userId);

  return true;
}

/**
 * Toggle favorito (agrega si no existe, elimina si existe)
 */
export async function toggleBusinessFavorite(
  businessId: string,
  userId: string,
): Promise<{ isFavorite: boolean; success: boolean }> {
  const isFavorite = await isBusinessFavorite(businessId, userId);

  if (isFavorite) {
    // Eliminar de favoritos y registrar interacción
    const success = await removeBusinessFromFavorites(businessId, userId);
    return { isFavorite: false, success };
  } else {
    // Agregar a favoritos y registrar interacción
    const success = await addBusinessToFavorites(businessId, userId);
    return { isFavorite: true, success };
  }
}

/**
 * Registra una interacción con un negocio
 * Incluye información de user agent para detectar bots
 */
async function registerBusinessInteraction(
  businessId: string,
  userId: string | null,
): Promise<void> {
  try {
    await supabase.from('business_interactions').insert({
      business_id_bin: businessId,
      user_id_bin: userId,
      // ip_address_bin se puede obtener desde el servidor o dejar null
    } as any);
  } catch (error) {
    // No bloqueamos si falla el tracking
    console.error('[businessLikes] Error registering interaction:', error);
  }
}
