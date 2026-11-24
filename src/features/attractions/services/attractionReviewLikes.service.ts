import { getLikeCounts } from '@/services/likeCounts.service';
import { supabase } from '@/lib/supabase/client';

/**
 * Obtiene los IDs de las reseñas a las que el usuario ha dado like
 */
export async function getUserLikedAttractionReviewIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('attraction_review_likes')
    .select('review_id_arl')
    .eq('user_id_arl', userId);

  if (error) {
    console.error('[attractionReviewLikes] Error fetching user liked reviews:', error.message);
    return [];
  }

  return data.map((item: any) => item.review_id_arl);
}

/**
 * Verifica si el usuario ha dado like a una reseña específica
 */
export async function isAttractionReviewLikedByUser(
  reviewId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('attraction_review_likes')
    .select('review_id_arl')
    .eq('review_id_arl', reviewId)
    .eq('user_id_arl', userId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

/**
 * Da like a una reseña
 */
export async function addAttractionReviewLike(reviewId: string, userId: string): Promise<boolean> {
  const { error } = await supabase.from('attraction_review_likes').insert({
    review_id_arl: reviewId,
    user_id_arl: userId,
  } as any);

  if (error) {
    console.error('[attractionReviewLikes] Error adding like:', error.message);
    return false;
  }

  return true;
}

/**
 * Quita el like de una reseña
 */
export async function removeAttractionReviewLike(
  reviewId: string,
  userId: string,
): Promise<boolean> {
  const { error } = await supabase
    .from('attraction_review_likes')
    .delete()
    .eq('review_id_arl', reviewId)
    .eq('user_id_arl', userId);

  if (error) {
    console.error('[attractionReviewLikes] Error removing like:', error.message);
    return false;
  }

  return true;
}

/**
 * Toggle like en una reseña (agrega si no existe, quita si existe)
 */
export async function toggleAttractionReviewLike(
  reviewId: string,
  userId: string,
): Promise<boolean> {
  const isLiked = await isAttractionReviewLikedByUser(reviewId, userId);

  if (isLiked) {
    return await removeAttractionReviewLike(reviewId, userId);
  } else {
    return await addAttractionReviewLike(reviewId, userId);
  }
}

/**
 * Obtiene el conteo de likes de una reseña
 */
export async function getAttractionReviewLikesCount(reviewId: string): Promise<number> {
  // Los likes son privados (S-18): contar filas devolvería solo los propios
  const counts = await getLikeCounts('attraction_review_likes', [reviewId]);
  return counts[reviewId] ?? 0;
}

