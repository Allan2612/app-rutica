import { useQuery } from '@tanstack/react-query';
import { getUserEvents } from '../services';
import { useAuthStore } from '@/store';

export function useUserEvents() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['user-events', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      return await getUserEvents(user.id);
    },
    enabled: !!user,
    // staleTime: 0 (usa configuración global para siempre refetch en foco)
  });
}
