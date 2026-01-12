import { useQuery } from '@tanstack/react-query';
import { getBusinessCategories } from '@/features/business/services/categories';

export function useBusinessCategories() {
    return useQuery({
        queryKey: ['businessCategories'],
        queryFn: getBusinessCategories,
    });
}
