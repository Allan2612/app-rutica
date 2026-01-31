import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { getUserLikedAttractionIds, getAttractionLikesCount } from '../services/attractionLikes.service';

/**
 * Hook para obtener los IDs de las atracciones a las que el usuario ha dado like
 */
export function useAttractionLikedIds() {
    const userId = useAuthStore((state) => state.user?.id);

    return useQuery({
        queryKey: ['attraction-likes', userId],
        queryFn: () => getUserLikedAttractionIds(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

/**
 * Hook para verificar si una atracción específica tiene like del usuario
 */
export function useIsAttractionLiked(attractionId: string) {
    const { data: likedIds = [] } = useAttractionLikedIds();
    return likedIds.includes(attractionId);
}

/**
 * Hook para obtener el conteo de likes de una atracción
 */
export function useAttractionLikesCount(attractionId: string) {
    return useQuery({
        queryKey: ['attraction-likes-count', attractionId],
        queryFn: () => getAttractionLikesCount(attractionId),
        enabled: !!attractionId,
        staleTime: 1 * 60 * 1000, // 1 minuto
    });
}
