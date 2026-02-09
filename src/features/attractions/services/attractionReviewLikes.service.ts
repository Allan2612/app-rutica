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
export async function isAttractionReviewLikedByUser(reviewId: string, userId: string): Promise<boolean> {
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
    const { error } = await supabase
        .from('attraction_review_likes')
        .insert({
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
export async function removeAttractionReviewLike(reviewId: string, userId: string): Promise<boolean> {
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
export async function toggleAttractionReviewLike(reviewId: string, userId: string): Promise<boolean> {
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
    const { count, error } = await supabase
        .from('attraction_review_likes')
        .select('*', { count: 'exact', head: true })
        .eq('review_id_arl', reviewId);

    if (error) {
        console.error('[attractionReviewLikes] Error counting likes:', error.message);
        return 0;
    }

    return count ?? 0;
}

/**
 * Obtiene el conteo de likes para múltiples reseñas
 */
export async function getMultipleAttractionReviewLikesCount(reviewIds: string[]): Promise<Record<string, number>> {
    if (reviewIds.length === 0) {
        return {};
    }

    const { data, error } = await supabase
        .from('attraction_review_likes')
        .select('review_id_arl')
        .in('review_id_arl', reviewIds);

    if (error) {
        console.error('[attractionReviewLikes] Error counting multiple likes:', error.message);
        return {};
    }

    // Contar likes por reseña
    const counts: Record<string, number> = {};
    reviewIds.forEach(id => counts[id] = 0);
    
    data.forEach((item: any) => {
        counts[item.review_id_arl] = (counts[item.review_id_arl] || 0) + 1;
    });

    return counts;
}
