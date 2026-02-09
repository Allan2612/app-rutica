import { useQuery } from '@tanstack/react-query';
import { getUserLikedEventIds, getEventLikesCount } from '../services/eventLikes.service';

/**
 * Hook para obtener los IDs de eventos a los que el usuario ha dado like
 */
export function useEventLikes(userId: string | undefined) {
  return useQuery({
    queryKey: ['event-likes', userId],
    queryFn: () => {
      if (!userId) return [];
      return getUserLikedEventIds(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para verificar si el usuario ha dado like a un evento específico
 */
export function useIsEventLiked(eventId: string | undefined, userId: string | undefined): boolean {
  const { data: likedEventIds } = useEventLikes(userId);

  if (!eventId || !likedEventIds) return false;

  return likedEventIds.includes(eventId);
}

/**
 * Hook para obtener el conteo de likes de un evento
 */
export function useEventLikesCount(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-likes-count', eventId],
    queryFn: () => {
      if (!eventId) return 0;
      return getEventLikesCount(eventId);
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
