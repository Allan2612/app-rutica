import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { getUserBusinessesFavoriteStats } from '@/services/premiumDashboard.service';

// ============================================
// Query Keys
// ============================================

export const premiumDashboardKeys = {
  all: ['premium', 'dashboard'] as const,
  stats: (userId: string, businessId: string | null, days: number) =>
    [...premiumDashboardKeys.all, 'stats', userId, businessId, days] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Hook para obtener las estadísticas de favoritos de los negocios del usuario
 * @param businessId - ID del negocio específico (opcional, null = todos)
 * @param days - Número de días para el período (7, 15, 30, 90)
 */
export function usePremiumDashboardStats(businessId: string | null = null, days: number = 30) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: premiumDashboardKeys.stats(userId ?? '', businessId, days),
    queryFn: () => getUserBusinessesFavoriteStats(userId!, businessId, days),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
