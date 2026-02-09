import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPendingVerifications,
  getVerificationStats,
  updateModerationStatus,
  getVerificationDetail,
  toggleEntityActive,
} from '../services/verification.service';
import type { VerificationFilters, UpdateModerationData, VerificationEntityType } from '../types';

// ============================================
// Query Keys
// ============================================

export const verificationKeys = {
  all: ['admin', 'verifications'] as const,
  lists: () => [...verificationKeys.all, 'list'] as const,
  list: (filters: VerificationFilters) => [...verificationKeys.lists(), filters] as const,
  stats: () => [...verificationKeys.all, 'stats'] as const,
  detail: (id: string, type: VerificationEntityType) =>
    [...verificationKeys.all, 'detail', id, type] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Hook to fetch pending verification requests with filters
 */
export function useVerificationRequests(filters: VerificationFilters = {}) {
  return useQuery({
    queryKey: verificationKeys.list(filters),
    queryFn: () => getPendingVerifications(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch verification statistics
 */
export function useVerificationStats() {
  return useQuery({
    queryKey: verificationKeys.stats(),
    queryFn: getVerificationStats,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch single verification detail
 */
export function useVerificationDetail(id: string, type: VerificationEntityType) {
  return useQuery({
    queryKey: verificationKeys.detail(id, type),
    queryFn: () => getVerificationDetail(id, type),
    enabled: !!id && !!type,
  });
}

/**
 * Hook to update moderation status (approve/reject)
 */
export function useUpdateModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateModerationData) => updateModerationStatus(data),
    onSuccess: () => {
      // Invalidate all verification queries to refresh data
      queryClient.invalidateQueries({ queryKey: verificationKeys.all });
    },
  });
}

/**
 * Hook to toggle entity active status
 */
export function useToggleActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      type,
      isActive,
    }: {
      id: string;
      type: VerificationEntityType;
      isActive: boolean;
    }) => toggleEntityActive(id, type, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: verificationKeys.all });
    },
  });
}
