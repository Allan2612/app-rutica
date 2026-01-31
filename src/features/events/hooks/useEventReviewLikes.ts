import { useQuery } from '@tanstack/react-query';
import { getUserLikedEventReviewIds, getEventReviewLikesCount } from '../services/eventReviewLikes.service';

/**
 * Hook para obtener los IDs de reseñas de eventos a las que el usuario ha dado like
 */
export function useEventReviewLikes(userId: string | undefined) {
    return useQuery({
        queryKey: ['event-review-likes', userId],
        queryFn: () => {
            if (!userId) return [];
            return getUserLikedEventReviewIds(userId);
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

/**
 * Hook para verificar si el usuario ha dado like a una reseña específica
 */
export function useIsEventReviewLiked(reviewId: string | undefined, userId: string | undefined): boolean {
    const { data: likedReviewIds } = useQuery({
        queryKey: ['event-review-likes', userId],
        queryFn: () => {
            if (!userId) return [];
            return getUserLikedEventReviewIds(userId);
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
    
    if (!reviewId || !likedReviewIds) return false;
    
    return likedReviewIds.includes(reviewId);
}

/**
 * Hook para obtener el conteo de likes de una reseña
 */
export function useEventReviewLikesCount(reviewId: string | undefined) {
    return useQuery({
        queryKey: ['event-review-likes-count', reviewId],
        queryFn: () => {
            if (!reviewId) return 0;
            return getEventReviewLikesCount(reviewId);
        },
        enabled: !!reviewId,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}
