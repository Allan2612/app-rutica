import { useQuery } from '@tanstack/react-query';
import { getAttractionCategories } from '@/features/attractions/services/categories';

export function useAttractionCategories() {
    return useQuery({
        queryKey: ['attractionCategories'],
        queryFn: getAttractionCategories,
    });
}
