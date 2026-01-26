import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from './contentModeration.service';

/**
 * Reseña con datos del autor para mostrar en UI
 */
export interface AttractionReviewDisplay {
    id: string;
    attractionId: string;
    userId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    authorName: string;
}

/**
 * Obtiene todas las reseñas de una atracción
 */
export async function getAttractionReviews(attractionId: string): Promise<AttractionReviewDisplay[]> {
    const { data, error } = await supabase
        .from('attraction_reviews')
        .select(`
            id_arv,
            attraction_id_arv,
            user_id_arv,
            rating_arv,
            comment_arv,
            created_at_arv,
            profiles (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('attraction_id_arv', attractionId)
        .order('created_at_arv', { ascending: false });

    if (error) {
        console.error('Error fetching attraction reviews:', error);
        return [];
    }

    return (data ?? []).map((review: any) => {
        const profile = review.profiles;
        const firstName = profile?.first_name_prf ?? '';
        const lastName = profile?.last_name1_prf ?? '';
        const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

        return {
            id: review.id_arv,
            attractionId: review.attraction_id_arv,
            userId: review.user_id_arv,
            rating: review.rating_arv,
            comment: review.comment_arv,
            createdAt: review.created_at_arv,
            authorName,
        };
    });
}

/**
 * Obtiene la reseña de un usuario para una atracción específica
 */
export async function getUserAttractionReview(
    attractionId: string,
    userId: string
): Promise<AttractionReviewDisplay | null> {
    const { data, error } = await supabase
        .from('attraction_reviews')
        .select(`
            id_arv,
            attraction_id_arv,
            user_id_arv,
            rating_arv,
            comment_arv,
            created_at_arv,
            profiles (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('attraction_id_arv', attractionId)
        .eq('user_id_arv', userId)
        .single();

    if (error || !data) {
        return null;
    }

    const profile = (data as any).profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: data.id_arv,
        attractionId: data.attraction_id_arv,
        userId: data.user_id_arv,
        rating: data.rating_arv,
        comment: data.comment_arv,
        createdAt: data.created_at_arv,
        authorName,
    };
}

/**
 * Crea una nueva reseña
 */
export async function createAttractionReview(
    attractionId: string,
    userId: string,
    rating: number,
    comment?: string
): Promise<AttractionReviewDisplay | null> {
    // Validar contenido antes de crear
    if (comment) {
        validateReviewContent(comment);
    }

    const { data, error } = await supabase
        .from('attraction_reviews')
        .insert({
            attraction_id_arv: attractionId,
            user_id_arv: userId,
            rating_arv: rating,
            comment_arv: comment || null,
        })
        .select(`
            id_arv,
            attraction_id_arv,
            user_id_arv,
            rating_arv,
            comment_arv,
            created_at_arv
        `)
        .single();

    if (error) {
        console.error('Error creating attraction review:', error);
        throw new Error(error.message);
    }

    // Actualizar el promedio de rating de la atracción
    await updateAttractionRating(attractionId);

    // Obtener el nombre del usuario
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', userId)
        .single();

    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: data.id_arv,
        attractionId: data.attraction_id_arv,
        userId: data.user_id_arv,
        rating: data.rating_arv,
        comment: data.comment_arv,
        createdAt: data.created_at_arv,
        authorName,
    };
}

/**
 * Actualiza una reseña existente
 */
export async function updateAttractionReview(
    reviewId: string,
    rating: number,
    comment?: string
): Promise<AttractionReviewDisplay | null> {
    // Validar contenido antes de actualizar
    if (comment) {
        validateReviewContent(comment);
    }

    const { data, error } = await supabase
        .from('attraction_reviews')
        .update({
            rating_arv: rating,
            comment_arv: comment || null,
        })
        .eq('id_arv', reviewId)
        .select(`
            id_arv,
            attraction_id_arv,
            user_id_arv,
            rating_arv,
            comment_arv,
            created_at_arv
        `)
        .single();

    if (error) {
        console.error('Error updating attraction review:', error);
        throw new Error(error.message);
    }

    // Actualizar el promedio de rating de la atracción
    await updateAttractionRating(data.attraction_id_arv);

    // Obtener el nombre del usuario
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', data.user_id_arv)
        .single();

    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: data.id_arv,
        attractionId: data.attraction_id_arv,
        userId: data.user_id_arv,
        rating: data.rating_arv,
        comment: data.comment_arv,
        createdAt: data.created_at_arv,
        authorName,
    };
}

/**
 * Elimina una reseña
 */
export async function deleteAttractionReview(reviewId: string, attractionId: string): Promise<void> {
    const { error } = await supabase
        .from('attraction_reviews')
        .delete()
        .eq('id_arv', reviewId);

    if (error) {
        console.error('Error deleting attraction review:', error);
        throw new Error(error.message);
    }

    // Actualizar el promedio de rating de la atracción
    await updateAttractionRating(attractionId);
}

/**
 * Actualiza el promedio de rating y conteo de reseñas de la atracción
 */
async function updateAttractionRating(attractionId: string): Promise<void> {
    // Obtener todas las reseñas de la atracción
    const { data: reviews, error } = await supabase
        .from('attraction_reviews')
        .select('rating_arv')
        .eq('attraction_id_arv', attractionId);

    if (error) {
        console.error('Error fetching reviews for rating update:', error);
        return;
    }

    const reviewCount = reviews?.length ?? 0;
    const avgRating = reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating_arv, 0) / reviewCount
        : 0;

    // Actualizar la atracción
    await supabase
        .from('attractions')
        .update({
            avg_rating_atr: Math.round(avgRating * 10) / 10,
            reviews_count_atr: reviewCount,
        })
        .eq('id_atr', attractionId);
}
