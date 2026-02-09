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
    const { error } = await supabase
        .from('event_review_likes')
        .insert({
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
    const { count, error } = await supabase
        .from('event_review_likes')
        .select('*', { count: 'exact', head: true })
        .eq('review_id_erl', reviewId);

    if (error) {
        console.error('[eventReviewLikes] Error counting likes:', error.message);
        return 0;
    }

    return count ?? 0;
}

/**
 * Obtiene el conteo de likes para múltiples reseñas de eventos
 */
export async function getMultipleEventReviewLikesCount(reviewIds: string[]): Promise<Record<string, number>> {
    if (reviewIds.length === 0) return {};

    const { data, error } = await supabase
        .from('event_review_likes')
        .select('review_id_erl')
        .in('review_id_erl', reviewIds);

    if (error) {
        console.error('[eventReviewLikes] Error fetching multiple review likes:', error.message);
        return {};
    }

    // Contar manualmente los likes por review
    const likesCount: Record<string, number> = {};
    reviewIds.forEach((id) => (likesCount[id] = 0));

    data.forEach((like: any) => {
        likesCount[like.review_id_erl] = (likesCount[like.review_id_erl] || 0) + 1;
    });

    return likesCount;
}
