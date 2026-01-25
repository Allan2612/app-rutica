/**
 * Hook para obtener el detalle de un evento
 */
import { useQuery } from '@tanstack/react-query';
import { getEventDetail } from '@/features/events/services/eventDetail.service';

export function useEventDetail(eventId: string) {
    return useQuery({
        queryKey: ['event-detail', eventId],
        queryFn: () => getEventDetail(eventId),
        enabled: !!eventId,
    });
}
