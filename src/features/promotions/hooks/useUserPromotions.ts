/**
 * Hooks para gestión de promociones del usuario
 * Siguiendo el patrón de useUserBusinesses.ts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUserPromotions,
    getPromotionsByBusiness,
    getPromotionById,
    deleteUserPromotion,
} from '../services/userPromotions.service';
import { updatePromotionComplete } from '../services/updatePromotion.service';
import { createPromotionComplete } from '../services/createPromotion.service';
import type { CreatePromotionData, UpdatePromotionData } from '@/types/entities';
import { useAuthStore } from '@/store';

// ============================================
// Query Keys
// ============================================

export const PROMOTIONS_KEYS = {
    all: ['promotions'] as const,
    user: (userId: string) => ['user-promotions', userId] as const,
    business: (businessId: string) => ['business-promotions', businessId] as const,
    detail: (promotionId: string) => ['promotion', promotionId] as const,
};

// ============================================
// GET Hooks
// ============================================

/**
 * Hook para obtener todas las promociones del usuario autenticado
 */
export function useUserPromotions() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: PROMOTIONS_KEYS.user(user?.id ?? ''),
        queryFn: async () => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            return getUserPromotions(user.id);
        },
        enabled: !!user?.id,
    });
}

/**
 * Hook para obtener promociones de un negocio específico
 */
export function useBusinessPromotions(businessId: string | undefined) {
    return useQuery({
        queryKey: PROMOTIONS_KEYS.business(businessId ?? ''),
        queryFn: async () => {
            if (!businessId) throw new Error('Business ID requerido');
            return getPromotionsByBusiness(businessId);
        },
        enabled: !!businessId,
    });
}

/**
 * Hook para obtener el detalle de una promoción para edición
 */
export function usePromotionById(promotionId: string | undefined) {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: PROMOTIONS_KEYS.detail(promotionId ?? ''),
        queryFn: async () => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            if (!promotionId) throw new Error('Promotion ID requerido');
            return getPromotionById(promotionId, user.id);
        },
        enabled: !!user?.id && !!promotionId,
        retry: false,
    });
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook para crear una nueva promoción
 */
export function useCreatePromotion() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: (data: CreatePromotionData) => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            return createPromotionComplete(user.id, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.user(user?.id ?? '') });
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.business(variables.businessId) });
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.all });
        },
    });
}

/**
 * Hook para actualizar una promoción
 */
export function useUpdatePromotion() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: ({ promotionId, data }: { promotionId: string; data: UpdatePromotionData }) => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            return updatePromotionComplete(promotionId, user.id, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.user(user?.id ?? '') });
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.detail(variables.promotionId) });
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.all });
        },
    });
}

/**
 * Hook para eliminar una promoción
 */
export function useDeletePromotion() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (promotionId: string) => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            return deleteUserPromotion(promotionId, user.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.user(user?.id ?? '') });
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEYS.all });
        },
    });
}
