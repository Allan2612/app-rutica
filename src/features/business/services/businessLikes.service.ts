import { supabase } from '@/lib/supabase/client';
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

  if (error) throw error;

  return data?.map((like) => like.business_id_blk) ?? [];
}

/**
 * Agrega un negocio a favoritos (idempotente: un doble tap no falla)
 */
export async function addBusinessToFavorites(businessId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('business_likes')
    .upsert({ business_id_blk: businessId, user_id_blk: userId } as never, {
      onConflict: 'business_id_blk,user_id_blk',
      ignoreDuplicates: true,
    });

  if (error) throw error;
}

/**
 * Elimina un negocio de favoritos
 */
export async function removeBusinessFromFavorites(
  businessId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from('business_likes')
    .delete()
    .eq('business_id_blk', businessId)
    .eq('user_id_blk', userId);

  if (error) throw error;
}

/**
 * Aplica el estado de favorito deseado.
 * Recibe el estado actual que conoce el cliente para no hacer "leer y luego escribir"
 * (dos round-trips y race condition con doble tap).
 */
export async function setBusinessFavorite(
  businessId: string,
  userId: string,
  favorite: boolean,
): Promise<{ isFavorite: boolean }> {
  if (favorite) {
    await addBusinessToFavorites(businessId, userId);
  } else {
    await removeBusinessFromFavorites(businessId, userId);
  }
  return { isFavorite: favorite };
}
