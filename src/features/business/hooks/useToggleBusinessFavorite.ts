import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setBusinessFavorite } from '../services/businessLikes.service';
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
      const current =
        queryClient.getQueryData<string[]>(['business-favorites', user.id]) ?? [];
      // El optimistic update de onMutate ya invirtió la caché: el estado deseado es el actual
      return setBusinessFavorite(businessId, user.id, current.includes(businessId));
    },
    onMutate: async (businessId: string) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['business-favorites', user?.id] });

      const previousFavorites =
        queryClient.getQueryData<string[]>(['business-favorites', user?.id]) ?? [];

      const isFavorite = previousFavorites.includes(businessId);
      const newFavorites = isFavorite
        ? previousFavorites.filter((id) => id !== businessId)
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
