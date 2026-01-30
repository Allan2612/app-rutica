import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from './contentModeration.service';
import type { Database } from '@/lib/supabase/database.types';

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
 * Tipo para el resultado del select con profile join
 */
type BusinessReviewRow = Database['public']['Tables']['business_reviews']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type BusinessReviewWithProfile = BusinessReviewRow & {
    profiles: Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
};

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
            profiles!business_reviews_user_id_brv_fkey (
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

    return ((data as unknown as BusinessReviewWithProfile[]) ?? []).map((review) => {
        const profile = review.profiles;
        const firstName = profile?.first_name_prf ?? '';
        const lastName = profile?.last_name1_prf ?? '';
        const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

        return {
            id: review.id_brv,
            businessId: review.business_id_brv ?? '',
            userId: review.user_id_brv ?? '',
            rating: review.rating_brv ?? 0,
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
            profiles!business_reviews_user_id_brv_fkey (
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

    const review = data as unknown as BusinessReviewWithProfile;
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_brv,
        businessId: review.business_id_brv ?? '',
        userId: review.user_id_brv ?? '',
        rating: review.rating_brv ?? 0,
        comment: review.comment_brv,
        createdAt: review.created_at_brv,
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

    // Verificar que el usuario no sea el dueño del negocio
    const { data: business, error: businessError } = await (supabase as any)
        .from('businesses')
        .select('owner_id_bus')
        .eq('id_bus', businessId)
        .single();

    if (businessError) {
        console.error('Error checking business ownership:', businessError);
        throw new Error('No se pudo verificar el negocio');
    }

    if ((business as any)?.owner_id_bus === userId) {
        throw new Error('No puedes dejar reseñas si eres el creador del negocio');
    }

    const { data, error } = await supabase
        .from('business_reviews')
        .insert({
            business_id_brv: businessId,
            user_id_brv: userId,
            rating_brv: rating,
            comment_brv: comment || null,
        } as any)
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

        // Mejorar mensaje de error RLS
        if (error.message.includes('row-level security policy')) {
            throw new Error('No tienes permiso para dejar una reseña en este negocio');
        }

        throw new Error(error.message);
    }

    const review = data as unknown as BusinessReviewRow;

    // Actualizar el promedio de rating del negocio
    await updateBusinessRating(businessId);

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
        id: review.id_brv,
        businessId: review.business_id_brv ?? '',
        userId: review.user_id_brv ?? '',
        rating: review.rating_brv ?? 0,
        comment: review.comment_brv,
        createdAt: review.created_at_brv,
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

    const updatePayload: any = {
        rating_brv: rating,
        comment_brv: comment || null,
    };

    const { data, error } = await (supabase as any)
        .from('business_reviews')
        .update(updatePayload)
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

    const review = data as unknown as BusinessReviewRow;

    // Actualizar el promedio de rating del negocio
    await updateBusinessRating(review.business_id_brv ?? '');

    // Obtener el nombre del usuario
    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', review.user_id_brv ?? '')
        .single();

    const profileData = profile as unknown as Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
    const firstName = profileData?.first_name_prf ?? '';
    const lastName = profileData?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_brv,
        businessId: review.business_id_brv ?? '',
        userId: review.user_id_brv ?? '',
        rating: review.rating_brv ?? 0,
        comment: review.comment_brv,
        createdAt: review.created_at_brv,
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
 * Usa una función SQL con SECURITY DEFINER para bypasear el trigger
 */
async function updateBusinessRating(businessId: string): Promise<void> {
    console.log('[updateBusinessRating] Starting update for business:', businessId);

    // Llamar a la función SQL que tiene privilegios para actualizar los campos protegidos
    const { error } = await (supabase as any).rpc('update_business_rating', {
        p_business_id: businessId
    });

    if (error) {
        console.error('[updateBusinessRating] Error calling RPC function:', error);

        // Fallback: Intentar actualización directa (funcionará si el trigger fue modificado)
        console.log('[updateBusinessRating] Trying direct update as fallback...');

        const { data: reviews, error: reviewsError } = await supabase
            .from('business_reviews')
            .select('rating_brv')
            .eq('business_id_brv', businessId);

        if (reviewsError) {
            console.error('[updateBusinessRating] Error fetching reviews:', reviewsError);
            return;
        }

        const reviewsData = reviews as unknown as Pick<BusinessReviewRow, 'rating_brv'>[] | null;
        const reviewCount = reviewsData?.length ?? 0;
        const avgRating = reviewCount > 0
            ? reviewsData!.reduce((sum, r) => sum + (r.rating_brv ?? 0), 0) / reviewCount
            : 0;

        const updatePayload: any = {
            avg_rating_bus: Math.round(avgRating * 10) / 10,
            reviews_count_bus: reviewCount,
        };

        console.log('[updateBusinessRating] Calculated:', { reviewCount, avgRating: updatePayload.avg_rating_bus });

        const { error: updateError } = await (supabase as any)
            .from('businesses')
            .update(updatePayload)
            .eq('id_bus', businessId);

        if (updateError) {
            console.error('[updateBusinessRating] Error updating business:', updateError);
        } else {
            console.log('[updateBusinessRating] Successfully updated business ratings (fallback)');
        }
    } else {
        console.log('[updateBusinessRating] Successfully updated business ratings via RPC');
    }
}
