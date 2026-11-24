import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from './contentModeration.service';
import type { Database } from '@/lib/supabase/database.types';
import { pageRange, type Page } from '@/services/listQuery';

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

export async function getProductReviews(
  productId: string,
  page = 0,
): Promise<Page<ProductReviewDisplay>> {
  const [from, to] = pageRange(page);
  const { data, error, count } = await supabase
    .from('product_reviews')
    .select(
      `
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
        `,
      { count: 'exact' },
    )
    .eq('product_id_prv', productId)
    .order('created_at_prv', { ascending: false })
    .order('id_prv', { ascending: true })
    .range(from, to);

  if (error) throw error;

  const rows = ((data as unknown as ProductReviewWithProfile[]) ?? []).map((review) => {
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    let authorPhotoUrl: string | null = null;
    if (profile?.profile_photo_path_prf) {
      const {
        data: { publicUrl },
      } = supabase.storage.from('profiles-images').getPublicUrl(profile.profile_photo_path_prf);
      authorPhotoUrl = publicUrl;
    }

    return {
      id: review.id_prv,
      productId: review.product_id_prv ?? '',
      userId: review.user_id_prv ?? '',
      rating: review.rating_prv ?? 0,
      comment: review.comment_prv,
      createdAt: review.created_at_prv ?? '',
      authorName,
      authorPhotoUrl,
    };
  });

  return { rows, total: count ?? 0 };
}

export async function createProductReview(
  productId: string,
  userId: string,
  rating: number,
  comment?: string,
): Promise<boolean> {
  // Mismo filtro de contenido que el resto de reseñas (antes productos no se validaban)
  if (comment) validateReviewContent(comment);
  const { error } = await supabase.from('product_reviews').insert({
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

export async function updateProductReview(
  reviewId: string,
  rating: number,
  comment?: string,
): Promise<boolean> {
  if (comment) validateReviewContent(comment);
  const { error } = await (supabase.from('product_reviews') as any)
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
  const { error } = await supabase.from('product_reviews').delete().eq('id_prv', reviewId);

  if (error) {
    console.error('[productReviews] Error deleting review:', error.message);
    return false;
  }

  return true;
}
