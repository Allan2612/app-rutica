import { getLikeCounts } from '@/services/likeCounts.service';
import { supabase } from '@/lib/supabase/client';

/**
 * Obtiene los IDs de las reseñas de eventos a las que el usuario ha dado like
 */
export async function getUserLikedEventReviewIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('event_review_likes')
    .select('review_id_erl')
    .eq('user_id_erl', userId);

  if (error) {
    console.error('[eventReviewLikes] Error fetching user liked reviews:', error.message);
    return [];
  }

  return data.map((item: any) => item.review_id_erl);
}

/**
 * Verifica si el usuario ha dado like a una reseña específica
 */
export async function isEventReviewLikedByUser(reviewId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('event_review_likes')
    .select('review_id_erl')
    .eq('review_id_erl', reviewId)
    .eq('user_id_erl', userId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

/**
 * Da like a una reseña de evento
 */
export async function addEventReviewLike(reviewId: string, userId: string): Promise<boolean> {
  const { error } = await supabase.from('event_review_likes').insert({
    review_id_erl: reviewId,
    user_id_erl: userId,
  } as any);

  if (error) {
    console.error('[eventReviewLikes] Error adding like:', error.message);
    return false;
  }

  return true;
}

/**
 * Quita el like de una reseña de evento
 */
export async function removeEventReviewLike(reviewId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('event_review_likes')
    .delete()
    .eq('review_id_erl', reviewId)
    .eq('user_id_erl', userId);

  if (error) {
    console.error('[eventReviewLikes] Error removing like:', error.message);
    return false;
  }

  return true;
}

/**
 * Toggle like en una reseña (agrega si no existe, quita si existe)
 */
export async function toggleEventReviewLike(reviewId: string, userId: string): Promise<boolean> {
  const isLiked = await isEventReviewLikedByUser(reviewId, userId);

  if (isLiked) {
    return await removeEventReviewLike(reviewId, userId);
  } else {
    return await addEventReviewLike(reviewId, userId);
  }
}

/**
 * Obtiene el conteo de likes de una reseña
 */
export async function getEventReviewLikesCount(reviewId: string): Promise<number> {
  // Los likes son privados (S-18): contar filas devolvería solo los propios
  const counts = await getLikeCounts('event_review_likes', [reviewId]);
  return counts[reviewId] ?? 0;
}

