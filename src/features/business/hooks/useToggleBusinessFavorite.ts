import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBusinessFavorite } from '../services/businessLikes.service';
import { useAuthStore } from '@/store';

/**
 * Hook para alternar el estado de favorito de un negocio
 */
export function useToggleBusinessFavorite() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (businessId: string) => {
            if (!user?.id) {
                throw new Error('Usuario no autenticado');
            }
            return toggleBusinessFavorite(businessId, user.id);
        },
        onMutate: async (businessId: string) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['business-favorites', user?.id] });

            const previousFavorites = queryClient.getQueryData<string[]>(['business-favorites', user?.id]) ?? [];

            const isFavorite = previousFavorites.includes(businessId);
            const newFavorites = isFavorite
                ? previousFavorites.filter(id => id !== businessId)
                : [...previousFavorites, businessId];

            queryClient.setQueryData(['business-favorites', user?.id], newFavorites);

            return { previousFavorites };
        },
        onError: (_err, _businessId, context) => {
            // Rollback on error
            if (context?.previousFavorites) {
                queryClient.setQueryData(['business-favorites', user?.id], context.previousFavorites);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['business-favorites', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['favorite-businesses'] });
        },
    });
}
