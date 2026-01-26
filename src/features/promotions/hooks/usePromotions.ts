/**
 * Hook para obtener promociones públicas
 * Similar a useBusinesses para listados públicos
 */

import { useQuery } from '@tanstack/react-query';
import { getPublicPromotions, PublicPromotionFilters } from '../services/publicPromotions.service';

export const PROMOTIONS_PUBLIC_KEYS = {
    all: ['public-promotions'] as const,
    list: (filters: PublicPromotionFilters) => ['public-promotions', filters] as const,
};

export interface UsePromotionsOptions extends PublicPromotionFilters {
    enabled?: boolean;
}

/**
 * Hook para obtener promociones públicas (aprobadas y activas)
 */
export function usePromotions({ enabled = true, ...filters }: UsePromotionsOptions = {}) {
    const { searchText = '', categoryIds = [] } = filters;

    return useQuery({
        queryKey: PROMOTIONS_PUBLIC_KEYS.list({ searchText, categoryIds }),
        queryFn: () => getPublicPromotions({ searchText, categoryIds }),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
