import { supabase } from '@/lib/supabase/client';
import { getLikeCounts } from '@/services/likeCounts.service';

/**
 * Fábrica de "me gusta" en reseñas (7.6): antes había tres copias casi idénticas
 * (negocio, evento, atracción). Los likes son privados (S-18): el conteo sale de la RPC.
 */
type ReviewLikesTable = 'business_review_likes' | 'event_review_likes' | 'attraction_review_likes';

export function createReviewLikesApi(table: ReviewLikesTable, sfx: 'brl' | 'erl' | 'arl') {
  const reviewCol = `review_id_${sfx}`;
  const userCol = `user_id_${sfx}`;
  // Columnas armadas por sufijo: los tipos generados no pueden inferirlas
  const from = () => (supabase as any).from(table);

  async function getUserLikedIds(userId: string): Promise<string[]> {
    const { data, error } = await from().select(reviewCol).eq(userCol, userId);
    if (error) {
      console.error(`[${table}] Error fetching user liked reviews:`, error.message);
      return [];
    }
    return ((data ?? []) as Record<string, string>[]).map((row) => row[reviewCol]);
  }

  async function isLikedByUser(reviewId: string, userId: string): Promise<boolean> {
    const { data, error } = await from()
      .select(reviewCol)
      .eq(reviewCol, reviewId)
      .eq(userCol, userId)
      .maybeSingle();
    return !error && !!data;
  }

  async function add(reviewId: string, userId: string): Promise<boolean> {
    const { error } = await from().insert({ [reviewCol]: reviewId, [userCol]: userId });
    if (error) console.error(`[${table}] Error adding like:`, error.message);
    return !error;
  }

  async function remove(reviewId: string, userId: string): Promise<boolean> {
    const { error } = await from().delete().eq(reviewCol, reviewId).eq(userCol, userId);
    if (error) console.error(`[${table}] Error removing like:`, error.message);
    return !error;
  }

  async function toggle(reviewId: string, userId: string): Promise<boolean> {
    return (await isLikedByUser(reviewId, userId)) ? remove(reviewId, userId) : add(reviewId, userId);
  }

  async function count(reviewId: string): Promise<number> {
    return (await getLikeCounts(table, [reviewId]))[reviewId] ?? 0;
  }

  return { getUserLikedIds, isLikedByUser, add, remove, toggle, count };
}
