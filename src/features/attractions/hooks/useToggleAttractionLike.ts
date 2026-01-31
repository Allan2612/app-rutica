import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleAttractionLike } from '../services/attractionLikes.service';
import { useAuthStore } from '@/store';

export function useToggleAttractionLike() {
    const queryClient = useQueryClient();
    const userId = useAuthStore((state) => state.user?.id);

    return useMutation({
        mutationFn: async (attractionId: string) => {
            if (!userId) {
                throw new Error('Usuario no autenticado');
            }
            return toggleAttractionLike(attractionId, userId);
        },
        onMutate: async (attractionId) => {
            // Cancelar queries en curso
            await queryClient.cancelQueries({ queryKey: ['attraction-likes', userId] });
            await queryClient.cancelQueries({ queryKey: ['attraction-likes-count', attractionId] });

            // Snapshot del estado anterior
            const previousLikedIds = queryClient.getQueryData<string[]>(['attraction-likes', userId]);
            const previousCount = queryClient.getQueryData<number>(['attraction-likes-count', attractionId]);

            // Optimistic update para likes del usuario
            if (previousLikedIds) {
                const isCurrentlyLiked = previousLikedIds.includes(attractionId);
                const newLikedIds = isCurrentlyLiked
                    ? previousLikedIds.filter(id => id !== attractionId)
                    : [...previousLikedIds, attractionId];

                queryClient.setQueryData(['attraction-likes', userId], newLikedIds);

                // Optimistic update para el conteo
                if (previousCount !== undefined) {
                    queryClient.setQueryData(
                        ['attraction-likes-count', attractionId],
                        isCurrentlyLiked ? previousCount - 1 : previousCount + 1
                    );
                }
            }

            return { previousLikedIds, previousCount };
        },
        onError: (err, attractionId, context) => {
            // Rollback en caso de error
            if (context?.previousLikedIds) {
                queryClient.setQueryData(['attraction-likes', userId], context.previousLikedIds);
            }
            if (context?.previousCount !== undefined) {
                queryClient.setQueryData(['attraction-likes-count', attractionId], context.previousCount);
            }
            console.error('[useToggleAttractionLike] Error:', err);
        },
        onSuccess: (_, attractionId) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ['attraction-likes', userId] });
            queryClient.invalidateQueries({ queryKey: ['attraction-likes-count', attractionId] });
        },
    });
}
