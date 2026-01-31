import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

export interface ProductReviewDisplay {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    authorName: string;
    authorPhotoUrl: string | null;
}

type ProductReviewRow = Database['public']['Tables']['product_reviews']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type ProductReviewWithProfile = ProductReviewRow & {
    profiles: Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf' | 'profile_photo_path_prf'> | null;
};

export async function getProductReviews(productId: string): Promise<ProductReviewDisplay[]> {
    const { data, error } = await supabase
        .from('product_reviews')
        .select(`
            id_prv,
            product_id_prv,
            user_id_prv,
            rating_prv,
            comment_prv,
            created_at_prv,
            profiles!product_reviews_user_id_prv_fkey (
                first_name_prf,
                last_name1_prf,
                profile_photo_path_prf
            )
        `)
        .eq('product_id_prv', productId)
        .order('created_at_prv', { ascending: false });

    if (error) {
        console.error('[productReviews] Error fetching reviews:', error.message);
        return [];
    }

    return ((data as unknown as ProductReviewWithProfile[]) ?? []).map((review) => {
        const profile = review.profiles;
        const firstName = profile?.first_name_prf ?? '';
        const lastName = profile?.last_name1_prf ?? '';
        const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

        let authorPhotoUrl: string | null = null;
        if (profile?.profile_photo_path_prf) {
            const { data: { publicUrl } } = supabase.storage
                .from('profiles-images')
                .getPublicUrl(profile.profile_photo_path_prf);
            authorPhotoUrl = publicUrl;
        }

        return {
            id: review.id_prv,
            productId: review.product_id_prv ?? '',
            userId: review.user_id_prv ?? '',
            rating: review.rating_prv ?? 0,
            comment: review.comment_prv,
            createdAt: review.created_at_prv,
            authorName,            authorPhotoUrl,        };
    });
}

export async function createProductReview(
    productId: string,
    userId: string,
    rating: number,
    comment?: string
): Promise<boolean> {
    const { error } = await supabase
        .from('product_reviews')
        .insert({
            product_id_prv: productId,
            user_id_prv: userId,
            rating_prv: rating,
            comment_prv: comment || null,
        });

    if (error) {
        console.error('[productReviews] Error creating review:', error.message);
        return false;
    }

    // El trigger se encarga de actualizar el rating automáticamente
    return true;
}

async function updateProductRating(productId: string): Promise<void> {
    // Intentar usar la función RPC con SECURITY DEFINER
    const { error: rpcError } = await supabase.rpc('update_product_rating', {
        p_product_id: productId
    });

    // Si el RPC funciona, terminamos aquí
    if (!rpcError) {
        return;
    }

    console.warn('RPC update_product_rating failed, using fallback method:', rpcError);

    // Fallback: calcular y actualizar manualmente (no debería ser necesario con el trigger)
    const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select('rating_prv')
        .eq('product_id_prv', productId);

    if (error) {
        return;
    }

    const reviewsData = reviews as unknown as Pick<ProductReviewRow, 'rating_prv'>[] | null;
    const reviewCount = reviewsData?.length ?? 0;
    const avgRating = reviewCount > 0
        ? reviewsData!.reduce((sum, r) => sum + (r.rating_prv ?? 0), 0) / reviewCount
        : 0;

    await supabase
        .from('products')
        .update({
            avg_rating_prd: Math.round(avgRating * 10) / 10,
            reviews_count_prd: reviewCount,
        })
        .eq('id_prd', productId);
}

export async function updateProductReview(
    reviewId: string,
    rating: number,
    comment?: string
): Promise<boolean> {
    const { error } = await supabase
        .from('product_reviews')
        .update({
            rating_prv: rating,
            comment_prv: comment || null,
        })
        .eq('id_prv', reviewId);

    if (error) {
        console.error('[productReviews] Error updating review:', error.message);
        return false;
    }

    return true;
}

export async function deleteProductReview(reviewId: string): Promise<boolean> {
    const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id_prv', reviewId);

    if (error) {
        console.error('[productReviews] Error deleting review:', error.message);
        return false;
    }

    return true;
}
