import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import {
  getUserActiveSubscriptions,
  getUserSubscriptionSummary,
  getUserSubscriptionDetails,
} from '@/services/userSubscriptions.service';
import type { SubscriptionType } from '@/types/enums';

// ============================================
// Query Keys
// ============================================

export const userSubscriptionKeys = {
  all: ['user', 'subscriptions'] as const,
  active: (userId: string) => [...userSubscriptionKeys.all, 'active', userId] as const,
  summary: (userId: string) => [...userSubscriptionKeys.all, 'summary', userId] as const,
  details: (userId: string) => [...userSubscriptionKeys.all, 'details', userId] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Hook para obtener las suscripciones activas del usuario actual
 */
export function useUserActiveSubscriptions() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: userSubscriptionKeys.active(userId || 'anonymous'),
    queryFn: () => {
      if (!userId) {
        return Promise.resolve([]);
      }
      return getUserActiveSubscriptions(userId);
    },
    enabled: !!userId,
    // staleTime: 0 (usa configuración global para siempre refetch en foco)
  });
}

/**
 * Hook para obtener el resumen de suscripciones del usuario actual
 */
export function useUserSubscriptionSummary() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: userSubscriptionKeys.summary(userId || 'anonymous'),
    queryFn: () => {
      if (!userId) {
        return Promise.resolve({
          hasActiveSubscriptions: false,
          activeCount: 0,
          subscriptions: [],
        });
      }
      return getUserSubscriptionSummary(userId);
    },
    enabled: !!userId,
    // staleTime: 0 (usa configuración global para siempre refetch en foco)
  });
}

/**
 * Hook para verificar si el usuario tiene una suscripción específica activa
 */
export function useHasActiveSubscription(subscriptionType: SubscriptionType) {
  const { data: subscriptions = [] } = useUserActiveSubscriptions();
  return subscriptions.some((s) => s.subscriptionType === subscriptionType);
}

/**
 * Hook para verificar si el usuario tiene premium completo
 */
export function useHasFullPremium() {
  return useHasActiveSubscription('full_premium');
}

/**
 * Hook para obtener las suscripciones con detalle completo de consumo
 */
export function useUserSubscriptionDetails() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: userSubscriptionKeys.details(userId || 'anonymous'),
    queryFn: () => {
      if (!userId) {
        return Promise.resolve([]);
      }
      return getUserSubscriptionDetails(userId);
    },
    enabled: !!userId,
    // staleTime: 0 (usa configuración global para siempre refetch en foco)
  });
}
