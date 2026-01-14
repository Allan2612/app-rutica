import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services';

/**
 * Hook para obtener todas las categorías del sistema
 */
export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 30 * 60 * 1000, // 30 minutos (las categorías no cambian frecuentemente)
    });
}
