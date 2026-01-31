import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleReviewLike } from '../services/businessReviewLikes.service';
import { useAuthStore } from '@/store';

export function useToggleReviewLike() {
    const queryClient = useQueryClient();
    const userId = useAuthStore((state) => state.user?.id);

    return useMutation({
        mutationFn: async (reviewId: string) => {
            if (!userId) {
                throw new Error('Usuario no autenticado');
            }
            return toggleReviewLike(reviewId, userId);
        },
        onMutate: async (reviewId) => {
            // Cancelar queries en curso
            await queryClient.cancelQueries({ queryKey: ['review-likes', userId] });

            // Snapshot del estado anterior
            const previousLikedIds = queryClient.getQueryData<string[]>(['review-likes', userId]);

            // Optimistic update
            if (previousLikedIds) {
                const isCurrentlyLiked = previousLikedIds.includes(reviewId);
                const newLikedIds = isCurrentlyLiked
                    ? previousLikedIds.filter(id => id !== reviewId)
                    : [...previousLikedIds, reviewId];

                queryClient.setQueryData(['review-likes', userId], newLikedIds);
            }

            return { previousLikedIds };
        },
        onError: (err, reviewId, context) => {
            // Rollback en caso de error
            if (context?.previousLikedIds) {
                queryClient.setQueryData(['review-likes', userId], context.previousLikedIds);
            }
            console.error('[useToggleReviewLike] Error:', err);
        },
        onSuccess: (_, reviewId) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['review-likes', userId] });
            // También invalidar las reviews para actualizar el contador
            queryClient.invalidateQueries({ queryKey: ['business-reviews'] });
        },
    });
}
