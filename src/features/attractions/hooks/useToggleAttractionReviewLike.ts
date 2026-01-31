import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleAttractionReviewLike } from '../services/attractionReviewLikes.service';
import { useAuthStore } from '@/store';

export function useToggleAttractionReviewLike() {
    const queryClient = useQueryClient();
    const userId = useAuthStore((state) => state.user?.id);

    return useMutation({
        mutationFn: async (reviewId: string) => {
            if (!userId) {
                throw new Error('Usuario no autenticado');
            }
            return toggleAttractionReviewLike(reviewId, userId);
        },
        onMutate: async (reviewId) => {
            // Cancelar queries en curso
            await queryClient.cancelQueries({ queryKey: ['attraction-review-likes', userId] });

            // Snapshot del estado anterior
            const previousLikedIds = queryClient.getQueryData<string[]>(['attraction-review-likes', userId]);

            // Optimistic update
            if (previousLikedIds) {
                const isCurrentlyLiked = previousLikedIds.includes(reviewId);
                const newLikedIds = isCurrentlyLiked
                    ? previousLikedIds.filter(id => id !== reviewId)
                    : [...previousLikedIds, reviewId];

                queryClient.setQueryData(['attraction-review-likes', userId], newLikedIds);
            }

            return { previousLikedIds };
        },
        onError: (err, reviewId, context) => {
            // Rollback en caso de error
            if (context?.previousLikedIds) {
                queryClient.setQueryData(['attraction-review-likes', userId], context.previousLikedIds);
            }
            console.error('[useToggleAttractionReviewLike] Error:', err);
        },
        onSuccess: (_, reviewId) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['attraction-review-likes', userId] });
            // También invalidar las reviews para actualizar el contador
            queryClient.invalidateQueries({ queryKey: ['attraction-reviews'] });
        },
    });
}
