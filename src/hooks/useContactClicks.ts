import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import {
  trackContactClick,
  getUserBusinessesContactStats,
  getUserBusinessOptions,
  ContactType,
  ContactPeriod,
} from '@/services/contactClicks.service';

// ============================================
// Query Keys
// ============================================

export const contactClicksKeys = {
  all: ['contactClicks'] as const,
  stats: (userId: string, days: ContactPeriod, businessId: string | null) =>
    [...contactClicksKeys.all, 'stats', userId, days, businessId] as const,
  businessOptions: (userId: string) => [...contactClicksKeys.all, 'businessOptions', userId] as const,
};

// ============================================
// Hooks
// ============================================

/**
 * Hook para obtener las opciones de negocios del usuario
 */
export function useUserBusinessOptions() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: contactClicksKeys.businessOptions(user?.id ?? ''),
    queryFn: () => getUserBusinessOptions(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para obtener estadísticas de clicks de contacto del usuario
 * @param businessId - Si se proporciona, filtra solo por ese negocio. Si es null, muestra todos.
 */
export function useContactClicksStats(days: ContactPeriod = 30, businessId: string | null = null) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: contactClicksKeys.stats(user?.id ?? '', days, businessId),
    queryFn: () => getUserBusinessesContactStats(user!.id, days, businessId),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para registrar un click de contacto
 */
export function useTrackContactClick() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      contactType,
    }: {
      businessId: string;
      contactType: ContactType;
    }) => trackContactClick(businessId, contactType, user?.id),
    onSuccess: () => {
      // Invalidar las estadísticas para que se actualicen
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: contactClicksKeys.all,
        });
      }
    },
  });
}
