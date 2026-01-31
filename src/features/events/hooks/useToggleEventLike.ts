import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleEventLike } from '../services/eventLikes.service';

interface ToggleEventLikeParams {
    eventId: string;
    userId: string;
}

/**
 * Hook para dar/quitar like a un evento con actualizaciones optimistas
 */
export function useToggleEventLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, userId }: ToggleEventLikeParams) => 
            toggleEventLike(eventId, userId),
        
        onMutate: async ({ eventId, userId }) => {
            // Cancelar queries en curso
            await queryClient.cancelQueries({ queryKey: ['event-likes', userId] });
            await queryClient.cancelQueries({ queryKey: ['event-likes-count', eventId] });

            // Snapshot del estado previo
            const previousLikes = queryClient.getQueryData<string[]>(['event-likes', userId]);
            const previousCount = queryClient.getQueryData<number>(['event-likes-count', eventId]);

            // Actualización optimista
            const isCurrentlyLiked = previousLikes?.includes(eventId) ?? false;
            
            if (isCurrentlyLiked) {
                // Quitar like
                queryClient.setQueryData<string[]>(
                    ['event-likes', userId],
                    (old) => old?.filter((id) => id !== eventId) ?? []
                );
                queryClient.setQueryData<number>(
                    ['event-likes-count', eventId],
                    (old) => Math.max(0, (old ?? 1) - 1)
                );
            } else {
                // Agregar like
                queryClient.setQueryData<string[]>(
                    ['event-likes', userId],
                    (old) => [...(old ?? []), eventId]
                );
                queryClient.setQueryData<number>(
                    ['event-likes-count', eventId],
                    (old) => (old ?? 0) + 1
                );
            }

            return { previousLikes, previousCount };
        },

        onError: (err, { eventId, userId }, context) => {
            // Revertir en caso de error
            if (context?.previousLikes) {
                queryClient.setQueryData(['event-likes', userId], context.previousLikes);
            }
            if (context?.previousCount !== undefined) {
                queryClient.setQueryData(['event-likes-count', eventId], context.previousCount);
            }
            console.error('[useToggleEventLike] Error toggling like:', err);
        },

        onSettled: (_, __, { eventId, userId }) => {
            // Refetch para asegurar consistencia
            queryClient.invalidateQueries({ queryKey: ['event-likes', userId] });
            queryClient.invalidateQueries({ queryKey: ['event-likes-count', eventId] });
        },
    });
}
