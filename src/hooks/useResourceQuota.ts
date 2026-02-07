import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getResourceQuota } from '@/services/subscriptionQuota.service';
import type { ResourceType } from '@/types/enums';
import type { QuotaInfo } from '@/types/entities/subscription';

// ============================================
// Hook principal para obtener cuota de recursos
// ============================================

interface UseResourceQuotaOptions {
    resourceType: ResourceType;
    entityId: string;
    entityType: 'business' | 'attraction' | 'event';
    enabled?: boolean;
}

interface UseResourceQuotaResult {
    quotaInfo: QuotaInfo | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Hook genérico para obtener información de cuota de cualquier recurso
 */
export function useResourceQuota({
    resourceType,
    entityId,
    entityType,
    enabled = true,
}: UseResourceQuotaOptions): UseResourceQuotaResult {
    const { user } = useAuthStore();
    const userId = user?.id;

    const queryKey = ['resourceQuota', resourceType, entityType, entityId, userId];

    const {
        data: quotaInfo,
        isLoading,
        error,
        refetch,
    } = useQuery<QuotaInfo, Error>({
        queryKey,
        queryFn: async () => {
            if (!userId) {
                throw new Error('Usuario no autenticado');
            }
            return getResourceQuota(userId, resourceType, entityId, entityType);
        },
        enabled: enabled && !!userId && !!entityId,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10,   // 10 minutos
    });

    return {
        quotaInfo: quotaInfo ?? null,
        isLoading,
        error: error ?? null,
        refetch,
    };
}

// ============================================
// Hooks específicos para cada tipo de recurso
// ============================================

/**
 * Hook para obtener cuota de productos de un negocio
 */
export function useProductQuota(businessId: string, enabled = true) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const userId = user?.id;

    const result = useResourceQuota({
        resourceType: 'product',
        entityId: businessId,
        entityType: 'business',
        enabled,
    });

    const invalidateQuota = () => {
        queryClient.invalidateQueries({
            queryKey: ['resourceQuota', 'product', 'business', businessId, userId],
        });
    };

    return {
        ...result,
        invalidateQuota,
    };
}

/**
 * Hook para obtener cuota de fotos de galería de negocio
 */
export function useBusinessGalleryQuota(businessId: string, enabled = true) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const userId = user?.id;

    const result = useResourceQuota({
        resourceType: 'photo_business',
        entityId: businessId,
        entityType: 'business',
        enabled,
    });

    const invalidateQuota = () => {
        queryClient.invalidateQueries({
            queryKey: ['resourceQuota', 'photo_business', 'business', businessId, userId],
        });
    };

    return {
        ...result,
        invalidateQuota,
    };
}

/**
 * Hook para obtener cuota de fotos de galería de atracción
 */
export function useAttractionGalleryQuota(attractionId: string, enabled = true) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const userId = user?.id;

    const result = useResourceQuota({
        resourceType: 'photo_attraction',
        entityId: attractionId,
        entityType: 'attraction',
        enabled,
    });

    const invalidateQuota = () => {
        queryClient.invalidateQueries({
            queryKey: ['resourceQuota', 'photo_attraction', 'attraction', attractionId, userId],
        });
    };

    return {
        ...result,
        invalidateQuota,
    };
}

/**
 * Hook para obtener cuota de fotos de galería de evento
 */
export function useEventGalleryQuota(eventId: string, enabled = true) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const userId = user?.id;

    const result = useResourceQuota({
        resourceType: 'photo_event',
        entityId: eventId,
        entityType: 'event',
        enabled,
    });

    const invalidateQuota = () => {
        queryClient.invalidateQueries({
            queryKey: ['resourceQuota', 'photo_event', 'event', eventId, userId],
        });
    };

    return {
        ...result,
        invalidateQuota,
    };
}

/**
 * Hook para obtener cuota de promociones de un negocio
 */
export function usePromotionQuota(businessId: string, enabled = true) {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const userId = user?.id;

    const result = useResourceQuota({
        resourceType: 'promotion',
        entityId: businessId,
        entityType: 'business',
        enabled,
    });

    const invalidateQuota = () => {
        queryClient.invalidateQueries({
            queryKey: ['resourceQuota', 'promotion', 'business', businessId, userId],
        });
    };

    return {
        ...result,
        invalidateQuota,
    };
}
