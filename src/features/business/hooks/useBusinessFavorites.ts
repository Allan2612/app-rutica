import { useQuery } from '@tanstack/react-query';
import { getUserFavoriteBusinessIds } from '../services/businessLikes.service';
import { useAuthStore } from '@/store';

/**
 * Hook para obtener los IDs de negocios favoritos del usuario actual
 */
export function useBusinessFavoriteIds() {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;

    return useQuery({
        queryKey: ['business-favorites', userId],
        queryFn: () => {
            if (!userId) return [];
            return getUserFavoriteBusinessIds(userId);
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

/**
 * Hook para verificar si un negocio específico es favorito
 */
export function useIsBusinessFavorite(businessId: string) {
    const { data: favoriteIds = [] } = useBusinessFavoriteIds();
    return favoriteIds.includes(businessId);
}
