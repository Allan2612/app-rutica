import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { getUserReviewDashboardStats } from '@/services/reviewStats.service';

// ============================================
// Query Keys
// ============================================

export const reviewStatsKeys = {
  all: ['reviewStats'] as const,
  dashboard: (userId: string, businessId: string | null, days: number) =>
    [...reviewStatsKeys.all, 'dashboard', userId, businessId, days] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Hook para obtener estadísticas de reseñas del dashboard
 */
export function useReviewDashboardStats(businessId: string | null = null, days: number = 30) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: reviewStatsKeys.dashboard(user?.id ?? '', businessId, days),
    queryFn: () => getUserReviewDashboardStats(user!.id, businessId, days),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
