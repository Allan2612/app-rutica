import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllSubscriptionsWithDetails,
  getSubscriptionStats,
  approveSubscription,
  rejectSubscription,
  getAllSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  activateSubscriptionPlan,
} from '../services/adminSubscriptions.service';
import { userSubscriptionKeys } from '@/hooks/useUserSubscriptions';
import { sendSubscriptionStatusEmail } from '@/services/emailNotification.service';
import type { SubscriptionFilters } from '../services/adminSubscriptions.service';
import type { Subscription } from '@/types/entities';

// ============================================
// Query Keys
// ============================================

export const adminSubscriptionKeys = {
  all: ['admin', 'subscriptions'] as const,
  lists: () => [...adminSubscriptionKeys.all, 'list'] as const,
  list: (filters: SubscriptionFilters) => [...adminSubscriptionKeys.lists(), filters] as const,
  stats: () => [...adminSubscriptionKeys.all, 'stats'] as const,
  catalog: () => [...adminSubscriptionKeys.all, 'catalog'] as const,
};

// ============================================
// Profile Subscriptions Hooks
// ============================================

/**
 * Hook para obtener todas las suscripciones de usuarios con filtros
 */
export function useAdminSubscriptions(filters: SubscriptionFilters = {}) {
  return useQuery({
    queryKey: adminSubscriptionKeys.list(filters),
    queryFn: () => getAllSubscriptionsWithDetails(filters),
    staleTime: 30 * 1000, // 30 segundos
  });
}

/**
 * Hook para obtener estadísticas de suscripciones
 */
export function useAdminSubscriptionStats() {
  return useQuery({
    queryKey: adminSubscriptionKeys.stats(),
    queryFn: getSubscriptionStats,
    staleTime: 60 * 1000, // 1 minuto
  });
}

/**
 * Hook para aprobar una suscripción
 */
export function useApproveSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => approveSubscription(subscriptionId),
    onSuccess: (result) => {
      // Invalidar queries de admin
      queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.all });
      // Invalidar queries de usuario para que vea su suscripción activa
      queryClient.invalidateQueries({ queryKey: userSubscriptionKeys.all });
      // Invalidar queries de cuotas de recursos (galerías, productos, etc.)
      queryClient.invalidateQueries({ queryKey: ['resourceQuota'] });

      // Enviar email de notificación al usuario
      if (result.profileId) {
        sendSubscriptionStatusEmail({
          profileId: result.profileId,
          userName: result.userName,
          packageName: result.packageName,
          status: 'approved',
        }).catch((err) => {
          console.warn('No se pudo enviar email de aprobación:', err);
        });
      }
    },
  });
}

/**
 * Hook para rechazar una suscripción
 */
export function useRejectSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subscriptionId, reason }: { subscriptionId: string; reason?: string }) =>
      rejectSubscription(subscriptionId, reason),
    onSuccess: (result) => {
      // Invalidar queries de admin
      queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.all });
      // Invalidar queries de usuario
      queryClient.invalidateQueries({ queryKey: userSubscriptionKeys.all });
      // Invalidar queries de cuotas de recursos
      queryClient.invalidateQueries({ queryKey: ['resourceQuota'] });

      // Enviar email de notificación al usuario
      if (result.profileId) {
        sendSubscriptionStatusEmail({
          profileId: result.profileId,
          userName: result.userName,
          packageName: result.packageName,
          status: 'rejected',
          rejectionReason: result.rejectionReason,
        }).catch((err) => {
          console.warn('No se pudo enviar email de rechazo:', err);
        });
      }
    },
  });
}

// ============================================
// Subscription Catalog Hooks
// ============================================

/**
 * Hook para obtener todos los planes de suscripción
 */
export function useSubscriptionCatalog() {
  return useQuery({
    queryKey: adminSubscriptionKeys.catalog(),
    queryFn: getAllSubscriptionPlans,
    staleTime: 0, // Siempre refrescar
  });
}

/**
 * Hook para crear un nuevo plan de suscripción
 */
export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: Omit<Subscription, 'id_sub' | 'created_at_sub' | 'updated_at_sub'>) =>
      createSubscriptionPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.catalog() });
    },
  });
}

/**
 * Hook para actualizar un plan de suscripción
 */
export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      planId,
      updates,
    }: {
      planId: string;
      updates: Partial<Omit<Subscription, 'id_sub' | 'created_at_sub'>>;
    }) => updateSubscriptionPlan(planId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.catalog() });
    },
  });
}

/**
 * Hook para eliminar (desactivar) un plan de suscripción
 */
export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => deleteSubscriptionPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.catalog() });
    },
  });
}

/**
 * Hook para activar un plan de suscripción
 */
export function useActivateSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => activateSubscriptionPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.catalog() });
    },
  });
}
