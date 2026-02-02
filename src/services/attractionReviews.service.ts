import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from './contentModeration.service';
import { getMultipleAttractionReviewLikesCount, getUserLikedAttractionReviewIds } from '@/features/attractions/services/attractionReviewLikes.service';
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
    likesCount: number;
    isLikedByUser: boolean;
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
export async function getAttractionReviews(attractionId: string, userId?: string): Promise<AttractionReviewDisplay[]> {
    const { data, error } = await supabase
        .from('attraction_reviews')
        .select(`
            id_arv,
            attraction_id_arv,
            user_id_arv,
            rating_arv,
            comment_arv,
            created_at_arv,
            profiles!attraction_reviews_user_id_arv_fkey (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('attraction_id_arv', attractionId)
        .order('created_at_arv', { ascending: false });

    if (error) {
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    const reviews = (data as unknown as AttractionReviewWithProfile[]) ?? [];
    const reviewIds = reviews.map(r => r.id_arv);

    // Obtener likes count para todas las reseñas
    const likesCountMap = await getMultipleAttractionReviewLikesCount(reviewIds);

    // Obtener IDs de reseñas con like del usuario actual (si está autenticado)
    const userLikedIds = userId ? await getUserLikedAttractionReviewIds(userId) : [];

    return reviews.map((review) => {
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
            likesCount: likesCountMap[review.id_arv] || 0,
            isLikedByUser: userLikedIds.includes(review.id_arv),
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
            profiles!attraction_reviews_user_id_arv_fkey (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('attraction_id_arv', attractionId)
        .eq('user_id_arv', userId)
        .maybeSingle();

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
    // Verificar sesión de Supabase
    const { data: { session } } = await supabase.auth.getSession();

    // Validar contenido antes de crear
    if (comment) {
        validateReviewContent(comment);
    }

    const insertData = {
        attraction_id_arv: attractionId,
        user_id_arv: userId,
        rating_arv: rating,
        comment_arv: comment || null,
    };

    const { data, error } = await supabase
        .from('attraction_reviews')
        .insert(insertData as any)
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
        throw new Error(error.message);
    }

    // Actualizar el promedio de rating de la atracción
    await updateAttractionRating(attractionId);
}

/**
 * Actualiza el promedio de rating y conteo de reseñas de la atracción
 * Usa una función SQL con SECURITY DEFINER para bypasear el trigger de protección
 */
async function updateAttractionRating(attractionId: string): Promise<void> {
    // Llamar a la función SQL que tiene privilegios para actualizar los campos protegidos
    const { error } = await (supabase as any).rpc('update_attraction_rating', {
        p_attraction_id: attractionId
    });

    if (error) {
        console.error('[updateAttractionRating] Error calling RPC:', error);
        // Fallback: Intentar actualización directa (funcionará si el trigger fue modificado)
        try {
            const { data: reviews, error: reviewsError } = await supabase
                .from('attraction_reviews')
                .select('rating_arv')
                .eq('attraction_id_arv', attractionId);

            if (reviewsError) {
                console.error('[updateAttractionRating] Error fetching reviews:', reviewsError);
                return;
            }

            const reviewsData = reviews as unknown as Pick<AttractionReviewRow, 'rating_arv'>[] | null;
            const reviewCount = reviewsData?.length ?? 0;
            const avgRating = reviewCount > 0
                ? reviewsData!.reduce((sum, r) => sum + (r.rating_arv ?? 0), 0) / reviewCount
                : 0;

            const updatePayload = {
                avg_rating_atr: Math.round(avgRating * 10) / 10,
                reviews_count_atr: reviewCount,
            };

            const { error: updateError } = await supabase
                .from('attractions')
                .update(updatePayload)
                .eq('id_atr', attractionId);

            if (updateError) {
                console.error('[updateAttractionRating] Error updating attraction (fallback):', updateError);
            }
        } catch (err) {
            console.error('[updateAttractionRating] Unexpected error in fallback:', err);
        }
    }
}
