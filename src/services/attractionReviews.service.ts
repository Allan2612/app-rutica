import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from './contentModeration.service';
import type { AttractionReview } from '@/types/entities';
import type { Database } from '@/lib/supabase/database.types';

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
 * Tipo para el resultado del select con profile join
 */
type AttractionReviewRow = Database['public']['Tables']['attraction_reviews']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type AttractionReviewWithProfile = AttractionReviewRow & {
    profiles: Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
};

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

    return ((data as unknown as AttractionReviewWithProfile[]) ?? []).map((review) => {
        const profile = review.profiles;
        const firstName = profile?.first_name_prf ?? '';
        const lastName = profile?.last_name1_prf ?? '';
        const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

        return {
            id: review.id_arv,
            attractionId: review.attraction_id_arv ?? '',
            userId: review.user_id_arv ?? '',
            rating: review.rating_arv ?? 0,
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

    const review = data as unknown as AttractionReviewWithProfile;
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_arv,
        attractionId: review.attraction_id_arv ?? '',
        userId: review.user_id_arv ?? '',
        rating: review.rating_arv ?? 0,
        comment: review.comment_arv,
        createdAt: review.created_at_arv,
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
        } as any)
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

    const review = data as unknown as AttractionReviewRow;

    // Actualizar el promedio de rating de la atracción
    await updateAttractionRating(attractionId);

    // Obtener el nombre del usuario
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', userId)
        .single();

    const profileData = profile as unknown as Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
    const firstName = profileData?.first_name_prf ?? '';
    const lastName = profileData?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_arv,
        attractionId: review.attraction_id_arv ?? '',
        userId: review.user_id_arv ?? '',
        rating: review.rating_arv ?? 0,
        comment: review.comment_arv,
        createdAt: review.created_at_arv,
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

    const updatePayload: any = {
        rating_arv: rating,
        comment_arv: comment || null,
    };

    const { data, error } = await (supabase as any)
        .from('attraction_reviews')
        .update(updatePayload)
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

    const review = data as unknown as AttractionReviewRow;

    // Actualizar el promedio de rating de la atracción
    await updateAttractionRating(review.attraction_id_arv ?? '');

    // Obtener el nombre del usuario
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', review.user_id_arv ?? '')
        .single();

    const profileData = profile as unknown as Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
    const firstName = profileData?.first_name_prf ?? '';
    const lastName = profileData?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_arv,
        attractionId: review.attraction_id_arv ?? '',
        userId: review.user_id_arv ?? '',
        rating: review.rating_arv ?? 0,
        comment: review.comment_arv,
        createdAt: review.created_at_arv,
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

    const reviewsData = reviews as unknown as Pick<AttractionReviewRow, 'rating_arv'>[] | null;
    const reviewCount = reviewsData?.length ?? 0;
    const avgRating = reviewCount > 0
        ? reviewsData!.reduce((sum, r) => sum + (r.rating_arv ?? 0), 0) / reviewCount
        : 0;

    const updatePayload: any = {
        avg_rating_atr: Math.round(avgRating * 10) / 10,
        reviews_count_atr: reviewCount,
    };

    // Actualizar la atracción
    await (supabase as any)
        .from('attractions')
        .update(updatePayload)
        .eq('id_atr', attractionId);
}
