import { supabase } from '@/lib/supabase/client';

/**
 * Obtiene los IDs de las reseñas a las que el usuario ha dado like
 */
export async function getUserLikedReviewIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('business_review_likes')
    .select('review_id_brl')
    .eq('user_id_brl', userId);

  if (error) {
    console.error('[businessReviewLikes] Error fetching user liked reviews:', error.message);
    return [];
  }

  return data.map((item: any) => item.review_id_brl);
}

/**
 * Verifica si el usuario ha dado like a una reseña específica
 */
export async function isReviewLikedByUser(reviewId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('business_review_likes')
    .select('review_id_brl')
    .eq('review_id_brl', reviewId)
    .eq('user_id_brl', userId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

/**
 * Da like a una reseña
 */
export async function addReviewLike(reviewId: string, userId: string): Promise<boolean> {
  const { error } = await supabase.from('business_review_likes').insert({
    review_id_brl: reviewId,
    user_id_brl: userId,
  } as any);

  if (error) {
    console.error('[businessReviewLikes] Error adding like:', error.message);
    return false;
  }

  return true;
}

/**
 * Quita el like de una reseña
 */
export async function removeReviewLike(reviewId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('business_review_likes')
    .delete()
    .eq('review_id_brl', reviewId)
    .eq('user_id_brl', userId);

  if (error) {
    console.error('[businessReviewLikes] Error removing like:', error.message);
    return false;
  }

  return true;
}

/**
 * Toggle like en una reseña (agrega si no existe, quita si existe)
 */
export async function toggleReviewLike(reviewId: string, userId: string): Promise<boolean> {
  const isLiked = await isReviewLikedByUser(reviewId, userId);

  if (isLiked) {
    return await removeReviewLike(reviewId, userId);
  } else {
    return await addReviewLike(reviewId, userId);
  }
}

/**
 * Obtiene el conteo de likes de una reseña
 */
export async function getReviewLikesCount(reviewId: string): Promise<number> {
  const { count, error } = await supabase
    .from('business_review_likes')
    .select('*', { count: 'exact', head: true })
    .eq('review_id_brl', reviewId);

  if (error) {
    console.error('[businessReviewLikes] Error counting likes:', error.message);
    return 0;
  }

  return count ?? 0;
}

/**
 * Obtiene el conteo de likes para múltiples reseñas
 */
export async function getMultipleReviewLikesCount(
  reviewIds: string[],
): Promise<Record<string, number>> {
  if (reviewIds.length === 0) {
    return {};
  }

  const { data, error } = await supabase
    .from('business_review_likes')
    .select('review_id_brl')
    .in('review_id_brl', reviewIds);

  if (error) {
    console.error('[businessReviewLikes] Error counting multiple likes:', error.message);
    return {};
  }

  // Contar likes por reseña
  const counts: Record<string, number> = {};
  reviewIds.forEach((id) => (counts[id] = 0));

  data.forEach((item: any) => {
    counts[item.review_id_brl] = (counts[item.review_id_brl] || 0) + 1;
  });

  return counts;
}
