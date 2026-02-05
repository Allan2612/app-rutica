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
        queryFn: () => getPublicPromotions({ searchText, categoryIds }),
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutos
        select: (promotions) => {
            // Filtrar por ubicación en JavaScript
            if (!district && !canton && !province) return promotions;
            
            return promotions.filter(promo => {
                const locationLabel = promo.businessLocation;
                if (!locationLabel) return false;
                
                const parts = locationLabel.split(', ');
                
                if (district) {
                    return parts.some(part => part.toLowerCase() === district.toLowerCase());
                } else if (canton) {
                    return parts.some(part => part.toLowerCase() === canton.toLowerCase());
                } else if (province) {
                    return parts.some(part => part.toLowerCase() === province.toLowerCase());
                }
                
                return true;
            });
        },
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
