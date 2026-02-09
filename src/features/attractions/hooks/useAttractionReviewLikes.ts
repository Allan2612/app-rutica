import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { getUserLikedAttractionReviewIds } from '../services/attractionReviewLikes.service';

/**
 * Hook para obtener los IDs de las reseñas a las que el usuario ha dado like
 */
export function useAttractionReviewLikedIds() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['attraction-review-likes', userId],
    queryFn: () => getUserLikedAttractionReviewIds(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para verificar si una reseña específica tiene like del usuario
 */
export function useIsAttractionReviewLiked(reviewId: string) {
  const { data: likedIds = [] } = useAttractionReviewLikedIds();
  return likedIds.includes(reviewId);
}
