import { useQuery } from '@tanstack/react-query';
import { getPaymentSettings, isPaymentConfigured } from '@/services/appSettings.service';

export function usePaymentSettings() {
  const query = useQuery({
    queryKey: ['app-settings', 'payment'],
    queryFn: getPaymentSettings,
    staleTime: 10 * 60 * 1000,
  });
  return { ...query, isConfigured: isPaymentConfigured(query.data) };
}
