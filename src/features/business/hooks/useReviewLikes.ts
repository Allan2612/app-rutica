import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { getUserLikedReviewIds } from '../services/businessReviewLikes.service';

/**
 * Hook para obtener los IDs de las reseñas a las que el usuario ha dado like
 */
export function useReviewLikedIds() {
    const userId = useAuthStore((state) => state.user?.id);

    return useQuery({
        queryKey: ['review-likes', userId],
        queryFn: () => getUserLikedReviewIds(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

/**
 * Hook para verificar si una reseña específica tiene like del usuario
 */
export function useIsReviewLiked(reviewId: string) {
    const { data: likedIds = [] } = useReviewLikedIds();
    return likedIds.includes(reviewId);
}
