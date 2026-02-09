/**
 * useHomeData Hook
 * Fetches all data needed for the Home screen
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getFeaturedPromotions,
  getFeaturedBusinesses,
  getFeaturedEvents,
  getFeaturedAttractions,
  getHomeStats,
} from '../services/home.service';

export const HOME_KEYS = {
  all: ['home'] as const,
  promotions: ['home', 'promotions'] as const,
  businesses: ['home', 'businesses'] as const,
  events: ['home', 'events'] as const,
  attractions: ['home', 'attractions'] as const,
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
 * Hook for featured businesses on Home
 */
export function useFeaturedBusinesses(limit: number = 5) {
  return useQuery({
    queryKey: [...HOME_KEYS.businesses, limit],
    queryFn: async () => {
      try {
        const result = await getFeaturedBusinesses(limit);
        return result;
      } catch (error) {
        console.error('[useHomeData] Error fetching businesses:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Hook for featured events on Home
 */
export function useFeaturedEvents(limit: number = 5) {
  return useQuery({
    queryKey: [...HOME_KEYS.events, limit],
    queryFn: async () => {
      try {
        const result = await getFeaturedEvents(limit);
        return result;
      } catch (error) {
        console.error('[useHomeData] Error fetching events:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Hook for featured attractions on Home
 */
export function useFeaturedAttractions(limit: number = 5) {
  return useQuery({
    queryKey: [...HOME_KEYS.attractions, limit],
    queryFn: async () => {
      try {
        const result = await getFeaturedAttractions(limit);
        return result;
      } catch (error) {
        console.error('[useHomeData] Error fetching attractions:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });
}

/**
 * Combined hook for all home data
 */
export function useHomeData() {
  const promotions = useFeaturedPromotions();
  const businesses = useFeaturedBusinesses();
  const events = useFeaturedEvents();
  const attractions = useFeaturedAttractions();
  const stats = useHomeStats();

  const refetch = useCallback(() => {
    promotions.refetch();
    businesses.refetch();
    events.refetch();
    attractions.refetch();
    stats.refetch();
  }, [promotions.refetch, businesses.refetch, events.refetch, attractions.refetch, stats.refetch]);

  return {
    promotions,
    businesses,
    events,
    attractions,
    stats,
    isLoading:
      promotions.isLoading ||
      businesses.isLoading ||
      events.isLoading ||
      attractions.isLoading ||
      stats.isLoading,
    isError:
      promotions.isError ||
      businesses.isError ||
      events.isError ||
      attractions.isError ||
      stats.isError,
    refetch,
  };
}
