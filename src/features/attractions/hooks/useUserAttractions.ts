import { useQuery } from '@tanstack/react-query';
import { getUserAttractions } from '../services';
import { useAuthStore } from '@/store';

export function useUserAttractions() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['user-attractions', user?.id],
        queryFn: async () => {
            if (!user) throw new Error('User not authenticated');
            return await getUserAttractions(user.id);
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });
}
