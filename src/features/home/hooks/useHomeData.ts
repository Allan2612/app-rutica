/**
 * useHomeData Hook
 * Fetches all data needed for the Home screen
 */

import { useQuery } from '@tanstack/react-query';
import { 
    getFeaturedPromotions, 
    getHomeStats 
} from '../services/home.service';

export const HOME_KEYS = {
    all: ['home'] as const,
    promotions: ['home', 'promotions'] as const,
    stats: ['home', 'stats'] as const,
};

/**
 * Hook for featured promotions on Home
 */
export function useFeaturedPromotions(limit: number = 6) {
    return useQuery({
        queryKey: [...HOME_KEYS.promotions, limit],
        queryFn: async () => {
            try {
                const result = await getFeaturedPromotions(limit);
                return result;
            } catch (error) {
                console.error('[useHomeData] Error fetching promotions:', error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        retryDelay: 1000,
    });
}

/**
 * Hook for home stats
 */
export function useHomeStats() {
    return useQuery({
        queryKey: HOME_KEYS.stats,
        queryFn: async () => {
            try {
                const result = await getHomeStats();
                return result;
            } catch (error) {
                console.error('[useHomeData] Error fetching stats:', error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
        retryDelay: 1000,
    });
}

/**
 * Combined hook for all home data
 */
export function useHomeData() {
    const promotions = useFeaturedPromotions();
    const stats = useHomeStats();

    return {
        promotions,
        stats,
        isLoading: promotions.isLoading || stats.isLoading,
        isError: promotions.isError || stats.isError,
        refetch: () => {
            promotions.refetch();
            stats.refetch();
        },
    };
}
