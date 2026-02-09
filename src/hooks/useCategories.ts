import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/categories.service';

/**
 * Hook centralizado para obtener todas las categorías del sistema
 * Usa la tabla central 'categories' compartida por todas las entidades
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutos (las categorías no cambian frecuentemente)
  });
}
