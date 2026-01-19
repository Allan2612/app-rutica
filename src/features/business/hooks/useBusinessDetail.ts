import { useQuery } from '@tanstack/react-query';
import { getBusinessDetail } from '@/features/business/services/businessDetail.service';

export function useBusinessDetail(businessId: string) {
    return useQuery({
        queryKey: ['business-detail', businessId],
        queryFn: () => getBusinessDetail(businessId),
        enabled: !!businessId,
    });
}
