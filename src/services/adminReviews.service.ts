import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import type { ReviewType, ReviewFilters, AdminReviewDisplay } from '@/features/admin/types';

/**
 * Verifica si el usuario actual es administrador
 */
async function isUserAdmin(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('profiles')
    .select('role_prf, is_active_prf')
    .eq('id_prf', user.id)
    .single<{ role_prf: string; is_active_prf: boolean }>();

  if (error || !data) return false;

  return data.role_prf === 'admin' && data.is_active_prf === true;
}

/**
 * Obtiene todas las reseñas de atracciones para administración
 */
async function getAttractionReviewsForAdmin(
  filters?: ReviewFilters,
): Promise<AdminReviewDisplay[]> {
  let query = supabase
    .from('attraction_reviews')
    .select(
      `
            id_arv,
            attraction_id_arv,
            user_id_arv,
            rating_arv,
            comment_arv,
            created_at_arv,
            profiles!attraction_reviews_user_id_arv_fkey (
                first_name_prf,
                last_name1_prf
            ),
            attractions!attraction_reviews_attraction_id_arv_fkey (
                name_atr
            )
        `,
    )
    .order('created_at_arv', { ascending: false });

  const { data, error } = await query;

  if (error || !data) {
    console.error('[adminReviews] Error fetching attraction reviews:', error);
    return [];
  }

  return data.map((review: any) => {
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';
    const contentTitle = review.attractions?.name_atr ?? 'Sin título';

    return {
      id: review.id_arv,
      type: 'attraction' as ReviewType,
      contentId: review.attraction_id_arv ?? '',
      contentTitle,
      userId: review.user_id_arv ?? '',
      authorName,
      rating: review.rating_arv ?? 0,
      comment: review.comment_arv,
      createdAt: review.created_at_arv,
    };
  });
}

/**
 * Obtiene todas las reseñas de negocios para administración
 */
async function getBusinessReviewsForAdmin(filters?: ReviewFilters): Promise<AdminReviewDisplay[]> {
  let query = supabase
    .from('business_reviews')
    .select(
      `
            id_brv,
            business_id_brv,
            user_id_brv,
            rating_brv,
            comment_brv,
            created_at_brv,
            profiles!business_reviews_user_id_brv_fkey (
                first_name_prf,
                last_name1_prf
            ),
            businesses!business_reviews_business_id_brv_fkey (
                name_bus
            )
        `,
    )
    .order('created_at_brv', { ascending: false });

  const { data, error } = await query;

  if (error || !data) {
    console.error('[adminReviews] Error fetching business reviews:', error);
    return [];
  }

  return data.map((review: any) => {
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';
    const contentTitle = review.businesses?.name_bus ?? 'Sin título';

    return {
      id: review.id_brv,
      type: 'business' as ReviewType,
      contentId: review.business_id_brv ?? '',
      contentTitle,
      userId: review.user_id_brv ?? '',
      authorName,
      rating: review.rating_brv ?? 0,
      comment: review.comment_brv,
      createdAt: review.created_at_brv,
    };
  });
}

/**
 * Obtiene todas las reseñas de eventos para administración
 */
async function getEventReviewsForAdmin(filters?: ReviewFilters): Promise<AdminReviewDisplay[]> {
  let query = supabase
    .from('event_reviews')
    .select(
      `
            id_erv,
            event_id_erv,
            user_id_erv,
            rating_erv,
            comment_erv,
            created_at_erv,
            profiles!event_reviews_user_id_erv_fkey (
                first_name_prf,
                last_name1_prf
            ),
            events!event_reviews_event_id_erv_fkey (
                name_evt
            )
        `,
    )
    .order('created_at_erv', { ascending: false });

  const { data, error } = await query;

  if (error || !data) {
    console.error('[adminReviews] Error fetching event reviews:', error);
    return [];
  }

  return data.map((review: any) => {
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';
    const contentTitle = review.events?.name_evt ?? 'Sin título';

    return {
      id: review.id_erv,
      type: 'event' as ReviewType,
      contentId: review.event_id_erv ?? '',
      contentTitle,
      userId: review.user_id_erv ?? '',
      authorName,
      rating: review.rating_erv ?? 0,
      comment: review.comment_erv,
      createdAt: review.created_at_erv,
    };
  });
}

/**
 * Obtiene todas las reseñas de productos para administración
 */
async function getProductReviewsForAdmin(filters?: ReviewFilters): Promise<AdminReviewDisplay[]> {
  let query = supabase
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
                last_name1_prf
            ),
            products!product_reviews_product_id_prv_fkey (
                name_prd
            )
        `,
    )
    .order('created_at_prv', { ascending: false });

  const { data, error } = await query;

  if (error || !data) {
    console.error('[adminReviews] Error fetching product reviews:', error);
    return [];
  }

  return data.map((review: any) => {
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';
    const contentTitle = review.products?.name_prd ?? 'Sin título';

    return {
      id: review.id_prv,
      type: 'product' as ReviewType,
      contentId: review.product_id_prv ?? '',
      contentTitle,
      userId: review.user_id_prv ?? '',
      authorName,
      rating: review.rating_prv ?? 0,
      comment: review.comment_prv,
      createdAt: review.created_at_prv,
    };
  });
}

/**
 * Obtiene todas las reseñas con filtros aplicados
 */
export async function getAllReviewsForAdmin(
  filters?: ReviewFilters,
): Promise<AdminReviewDisplay[]> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('No tienes permisos de administrador');
  }

  // Si hay un filtro de tipo específico, solo obtener ese tipo
  if (filters?.type) {
    switch (filters.type) {
      case 'attraction':
        return getAttractionReviewsForAdmin(filters);
      case 'business':
        return getBusinessReviewsForAdmin(filters);
      case 'event':
        return getEventReviewsForAdmin(filters);
      case 'product':
        return getProductReviewsForAdmin(filters);
    }
  }

  // Si no hay filtro de tipo, obtener todas
  const [attractions, businesses, events, products] = await Promise.all([
    getAttractionReviewsForAdmin(filters),
    getBusinessReviewsForAdmin(filters),
    getEventReviewsForAdmin(filters),
    getProductReviewsForAdmin(filters),
  ]);

  const allReviews = [...attractions, ...businesses, ...events, ...products];

  // Aplicar filtro de rating
  let filteredReviews = allReviews;
  if (filters?.minRating !== undefined) {
    filteredReviews = filteredReviews.filter((review) => review.rating >= filters.minRating!);

    // Ordenar por rating ascendente (primero las del rating mínimo seleccionado) y luego por fecha descendente
    filteredReviews.sort((a, b) => {
      if (a.rating !== b.rating) {
        return a.rating - b.rating; // Ascendente por rating
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Descendente por fecha
    });
  } else {
    // Si no hay filtro de rating, ordenar solo por fecha descendente
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Filtrar por término de búsqueda si existe
  if (filters?.searchTerm && filters.searchTerm.trim()) {
    const searchLower = filters.searchTerm.toLowerCase();
    return filteredReviews.filter((review) => {
      return (
        review.authorName.toLowerCase().includes(searchLower) ||
        review.contentTitle.toLowerCase().includes(searchLower) ||
        review.comment?.toLowerCase().includes(searchLower)
      );
    });
  }

  return filteredReviews;
}

/**
 * Elimina una reseña como administrador y actualiza el rating
 */
export async function deleteReviewAsAdmin(
  reviewId: string,
  type: ReviewType,
  contentId: string,
): Promise<void> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('No tienes permisos de administrador');
  }

  let error;

  switch (type) {
    case 'attraction':
      ({ error } = await supabase.from('attraction_reviews').delete().eq('id_arv', reviewId));

      if (!error) {
        // Actualizar el promedio de rating
        const { error: rpcError } = await (supabase as any).rpc('update_attraction_rating', {
          p_attraction_id: contentId,
        });
        if (rpcError) {
          console.error('[deleteReviewAsAdmin] Error updating rating:', rpcError);
        }
      }
      break;

    case 'business':
      ({ error } = await supabase.from('business_reviews').delete().eq('id_brv', reviewId));

      if (!error) {
        // Actualizar el promedio de rating
        const { error: rpcError } = await (supabase as any).rpc('update_business_rating', {
          p_business_id: contentId,
        });
        if (rpcError) {
          console.error('[deleteReviewAsAdmin] Error updating rating:', rpcError);
        }
      }
      break;

    case 'event':
      ({ error } = await supabase.from('event_reviews').delete().eq('id_erv', reviewId));

      if (!error) {
        // Actualizar el promedio de rating
        const { error: rpcError } = await (supabase as any).rpc('update_event_rating', {
          p_event_id: contentId,
        });
        if (rpcError) {
          console.error('[deleteReviewAsAdmin] Error updating rating:', rpcError);
        }
      }
      break;

    case 'product':
      ({ error } = await supabase.from('product_reviews').delete().eq('id_prv', reviewId));
      break;
  }

  if (error) {
    console.error('[adminReviews] Error deleting review:', error);
    throw new Error(`Error al eliminar la reseña: ${error.message}`);
  }
}

/**
 * Actualiza una reseña como administrador
 */
export async function updateReviewAsAdmin(
  reviewId: string,
  type: ReviewType,
  contentId: string,
  rating: number,
  comment: string,
): Promise<void> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('No tienes permisos de administrador');
  }

  let error;

  switch (type) {
    case 'attraction':
      ({ error } = await (supabase.from('attraction_reviews') as any)
        .update({
          rating_arv: rating,
          comment_arv: comment || null,
        })
        .eq('id_arv', reviewId));

      if (!error) {
        // Actualizar el promedio de rating
        const { error: rpcError } = await (supabase as any).rpc('update_attraction_rating', {
          p_attraction_id: contentId,
        });
        if (rpcError) {
          console.error('[updateReviewAsAdmin] Error updating rating:', rpcError);
        }
      }
      break;

    case 'business':
      ({ error } = await (supabase.from('business_reviews') as any)
        .update({
          rating_brv: rating,
          comment_brv: comment || null,
        })
        .eq('id_brv', reviewId));

      if (!error) {
        // Actualizar el promedio de rating
        const { error: rpcError } = await (supabase as any).rpc('update_business_rating', {
          p_business_id: contentId,
        });
        if (rpcError) {
          console.error('[updateReviewAsAdmin] Error updating rating:', rpcError);
        }
      }
      break;

    case 'event':
      ({ error } = await (supabase.from('event_reviews') as any)
        .update({
          rating_erv: rating,
          comment_erv: comment || null,
        })
        .eq('id_erv', reviewId));

      if (!error) {
        // Actualizar el promedio de rating
        const { error: rpcError } = await (supabase as any).rpc('update_event_rating', {
          p_event_id: contentId,
        });
        if (rpcError) {
          console.error('[updateReviewAsAdmin] Error updating rating:', rpcError);
        }
      }
      break;

    case 'product':
      ({ error } = await (supabase.from('product_reviews') as any)
        .update({
          rating_prv: rating,
          comment_prv: comment || null,
        })
        .eq('id_prv', reviewId));

      if (!error) {
        // Actualizar el promedio de rating
        const { error: rpcError } = await (supabase as any).rpc('update_product_rating', {
          p_product_id: contentId,
        });
        if (rpcError) {
          console.error('[updateReviewAsAdmin] Error updating rating:', rpcError);
        }
      }
      break;
  }

  if (error) {
    console.error('[adminReviews] Error updating review:', error);
    throw new Error(`Error al actualizar la reseña: ${error.message}`);
  }
}

/**
 * Obtiene estadísticas de reseñas para el panel de administración
 */
export async function getReviewsStats(): Promise<{
  totalReviews: number;
  byType: Record<ReviewType, number>;
  averageRating: number;
}> {
  const isAdmin = await isUserAdmin();
  if (!isAdmin) {
    throw new Error('No tienes permisos de administrador');
  }

  const [attractions, businesses, events, products] = await Promise.all([
    supabase.from('attraction_reviews').select('rating_arv', { count: 'exact' }),
    supabase.from('business_reviews').select('rating_brv', { count: 'exact' }),
    supabase.from('event_reviews').select('rating_erv', { count: 'exact' }),
    supabase.from('product_reviews').select('rating_prv', { count: 'exact' }),
  ]);

  const attractionCount = attractions.count ?? 0;
  const businessCount = businesses.count ?? 0;
  const eventCount = events.count ?? 0;
  const productCount = products.count ?? 0;

  const totalReviews = attractionCount + businessCount + eventCount + productCount;

  // Calcular promedio general de ratings
  const allRatings = [
    ...(attractions.data?.map((r: any) => r.rating_arv) ?? []),
    ...(businesses.data?.map((r: any) => r.rating_brv) ?? []),
    ...(events.data?.map((r: any) => r.rating_erv) ?? []),
    ...(products.data?.map((r: any) => r.rating_prv) ?? []),
  ].filter((r) => r != null);

  const averageRating =
    allRatings.length > 0
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
      : 0;

  return {
    totalReviews,
    byType: {
      attraction: attractionCount,
      business: businessCount,
      event: eventCount,
      product: productCount,
    },
    averageRating,
  };
}
