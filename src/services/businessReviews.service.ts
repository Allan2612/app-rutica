import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from './contentModeration.service';

/**
 * Reseña con datos del autor para mostrar en UI
 */
export interface BusinessReviewDisplay {
    id: string;
    businessId: string;
    userId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    authorName: string;
}

/**
 * Obtiene todas las reseñas de un negocio
 */
export async function getBusinessReviews(businessId: string): Promise<BusinessReviewDisplay[]> {
    const { data, error } = await supabase
        .from('business_reviews')
        .select(`
            id_brv,
            business_id_brv,
            user_id_brv,
            rating_brv,
            comment_brv,
            created_at_brv,
            profiles (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('business_id_brv', businessId)
        .order('created_at_brv', { ascending: false });

    if (error) {
        console.error('Error fetching business reviews:', error);
        return [];
    }

    return (data ?? []).map((review: any) => {
        const profile = review.profiles;
        const firstName = profile?.first_name_prf ?? '';
        const lastName = profile?.last_name1_prf ?? '';
        const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

        return {
            id: review.id_brv,
            businessId: review.business_id_brv,
            userId: review.user_id_brv,
            rating: review.rating_brv,
            comment: review.comment_brv,
            createdAt: review.created_at_brv,
            authorName,
        };
    });
}

/**
 * Obtiene la reseña de un usuario para un negocio específico
 */
export async function getUserBusinessReview(
    businessId: string,
    userId: string
): Promise<BusinessReviewDisplay | null> {
    const { data, error } = await supabase
        .from('business_reviews')
        .select(`
            id_brv,
            business_id_brv,
            user_id_brv,
            rating_brv,
            comment_brv,
            created_at_brv,
            profiles!user_id_brv (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('business_id_brv', businessId)
        .eq('user_id_brv', userId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching user business review:', error);
        return null;
    }
    
    if (!data) {
        return null;
    }

    const profile = (data as any).profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: data.id_brv,
        businessId: data.business_id_brv,
        userId: data.user_id_brv,
        rating: data.rating_brv,
        comment: data.comment_brv,
        createdAt: data.created_at_brv,
        authorName,
    };
}

/**
 * Crea una nueva reseña
 */
export async function createBusinessReview(
    businessId: string,
    userId: string,
    rating: number,
    comment?: string
): Promise<BusinessReviewDisplay | null> {
    // Validar contenido antes de crear
    if (comment) {
        validateReviewContent(comment);
    }

    const { data, error } = await supabase
        .from('business_reviews')
        .insert({
            business_id_brv: businessId,
            user_id_brv: userId,
            rating_brv: rating,
            comment_brv: comment || null,
        })
        .select(`
            id_brv,
            business_id_brv,
            user_id_brv,
            rating_brv,
            comment_brv,
            created_at_brv
        `)
        .single();

    if (error) {
        console.error('Error creating business review:', error);
        throw new Error(error.message);
    }

    // Actualizar el promedio de rating del negocio
    await updateBusinessRating(businessId);

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
        id: data.id_brv,
        businessId: data.business_id_brv,
        userId: data.user_id_brv,
        rating: data.rating_brv,
        comment: data.comment_brv,
        createdAt: data.created_at_brv,
        authorName,
    };
}

/**
 * Actualiza una reseña existente
 */
export async function updateBusinessReview(
    reviewId: string,
    rating: number,
    comment?: string
): Promise<BusinessReviewDisplay | null> {
    // Validar contenido antes de actualizar
    if (comment) {
        validateReviewContent(comment);
    }

    const { data, error } = await supabase
        .from('business_reviews')
        .update({
            rating_brv: rating,
            comment_brv: comment || null,
        })
        .eq('id_brv', reviewId)
        .select(`
            id_brv,
            business_id_brv,
            user_id_brv,
            rating_brv,
            comment_brv,
            created_at_brv
        `)
        .single();

    if (error) {
        console.error('Error updating business review:', error);
        throw new Error(error.message);
    }

    // Actualizar el promedio de rating del negocio
    await updateBusinessRating(data.business_id_brv);

    // Obtener el nombre del usuario
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', data.user_id_brv)
        .single();

    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: data.id_brv,
        businessId: data.business_id_brv,
        userId: data.user_id_brv,
        rating: data.rating_brv,
        comment: data.comment_brv,
        createdAt: data.created_at_brv,
        authorName,
    };
}

/**
 * Elimina una reseña
 */
export async function deleteBusinessReview(reviewId: string, businessId: string): Promise<void> {
    const { error } = await supabase
        .from('business_reviews')
        .delete()
        .eq('id_brv', reviewId);

    if (error) {
        console.error('Error deleting business review:', error);
        throw new Error(error.message);
    }

    // Actualizar el promedio de rating del negocio
    await updateBusinessRating(businessId);
}

/**
 * Actualiza el promedio de rating y conteo de reseñas del negocio
 */
async function updateBusinessRating(businessId: string): Promise<void> {
    // Obtener todas las reseñas del negocio
    const { data: reviews, error } = await supabase
        .from('business_reviews')
        .select('rating_brv')
        .eq('business_id_brv', businessId);

    if (error) {
        console.error('Error fetching reviews for rating update:', error);
        return;
    }

    const reviewCount = reviews?.length ?? 0;
    const avgRating = reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating_brv, 0) / reviewCount
        : 0;

    // Actualizar el negocio
    await supabase
        .from('businesses')
        .update({
            avg_rating_bus: Math.round(avgRating * 10) / 10, // Redondear a 1 decimal
            reviews_count_bus: reviewCount,
        })
        .eq('id_bus', businessId);
}
