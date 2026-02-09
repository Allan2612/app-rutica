import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleEventReviewLike } from '../services/eventReviewLikes.service';

interface ToggleEventReviewLikeParams {
  reviewId: string;
  userId: string;
}

/**
 * Hook para dar/quitar like a una reseña de evento con actualizaciones optimistas
 */
export function useToggleEventReviewLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, userId }: ToggleEventReviewLikeParams) =>
      toggleEventReviewLike(reviewId, userId),

    onMutate: async ({ reviewId, userId }) => {
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['event-review-likes', userId] });
      await queryClient.cancelQueries({ queryKey: ['event-review-likes-count', reviewId] });

      // Snapshot del estado previo
      const previousLikes = queryClient.getQueryData<string[]>(['event-review-likes', userId]);
      const previousCount = queryClient.getQueryData<number>([
        'event-review-likes-count',
        reviewId,
      ]);

      // Actualización optimista
      const isCurrentlyLiked = previousLikes?.includes(reviewId) ?? false;

      if (isCurrentlyLiked) {
        // Quitar like
        queryClient.setQueryData<string[]>(
          ['event-review-likes', userId],
          (old) => old?.filter((id) => id !== reviewId) ?? [],
        );
        queryClient.setQueryData<number>(['event-review-likes-count', reviewId], (old) =>
          Math.max(0, (old ?? 1) - 1),
        );
      } else {
        // Agregar like
        queryClient.setQueryData<string[]>(['event-review-likes', userId], (old) => [
          ...(old ?? []),
          reviewId,
        ]);
        queryClient.setQueryData<number>(
          ['event-review-likes-count', reviewId],
          (old) => (old ?? 0) + 1,
        );
      }

      return { previousLikes, previousCount };
    },

    onError: (err, { reviewId, userId }, context) => {
      // Revertir en caso de error
      if (context?.previousLikes) {
        queryClient.setQueryData(['event-review-likes', userId], context.previousLikes);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(['event-review-likes-count', reviewId], context.previousCount);
      }
      console.error('[useToggleEventReviewLike] Error toggling like:', err);
    },

    onSettled: (_, __, { reviewId, userId }) => {
      // Refetch para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: ['event-review-likes', userId] });
      queryClient.invalidateQueries({ queryKey: ['event-review-likes-count', reviewId] });
      // También invalidar las reviews para actualizar likesCount e isLikedByUser
      queryClient.invalidateQueries({ queryKey: ['event-reviews'] });
    },
  });
}
