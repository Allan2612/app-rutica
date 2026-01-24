/**
 * Hook para obtener el detalle de una atracción
 */
import { useQuery } from '@tanstack/react-query';
import { getAttractionDetail } from '@/features/attractions/services/attractionDetail.service';

export function useAttractionDetail(attractionId: string) {
    return useQuery({
        queryKey: ['attraction-detail', attractionId],
        queryFn: () => getAttractionDetail(attractionId),
        enabled: !!attractionId,
    });
}
