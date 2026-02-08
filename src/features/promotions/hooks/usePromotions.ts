/**
 * Hook para obtener promociones públicas
 * Similar a useBusinesses para listados públicos
 */

import { useQuery } from '@tanstack/react-query';
import { 
    getPublicPromotions, 
    getBusinessActivePromotions,
    PublicPromotionFilters 
} from '../services/publicPromotions.service';

export const PROMOTIONS_PUBLIC_KEYS = {
    all: ['public-promotions'] as const,
    list: (filters: PublicPromotionFilters) => ['public-promotions', filters] as const,
    business: (businessId: string) => ['business-active-promotions', businessId] as const,
};

export interface UsePromotionsOptions extends PublicPromotionFilters {
    enabled?: boolean;
}

/**
 * Hook para obtener promociones públicas (aprobadas y activas)
 */
export function usePromotions({ enabled = true, ...filters }: UsePromotionsOptions = {}) {
    const { searchText = '', categoryIds = [], province, canton, district } = filters;

    return useQuery({
        queryKey: PROMOTIONS_PUBLIC_KEYS.list({ searchText, categoryIds, province, canton, district }),
        queryFn: () => getPublicPromotions({ searchText, categoryIds, province, canton, district }),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}

/**
 * Hook para obtener promociones activas de un negocio específico
 * Para mostrar en la vista pública del negocio y aplicar descuentos
 */
export function useBusinessActivePromotions(businessId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: PROMOTIONS_PUBLIC_KEYS.business(businessId),
        queryFn: () => getBusinessActivePromotions(businessId),
        enabled: enabled && !!businessId,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
