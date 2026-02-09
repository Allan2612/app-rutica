/**
 * Hook para obtener marcadores del mapa con TanStack Query
 */
import { useQuery, useQueries, UseQueryOptions } from '@tanstack/react-query';
import {
  getBusinessMarkers,
  getAttractionMarkers,
  getEventMarkers,
  getAllMarkers,
} from '../services/mapMarkers.service';
import type { MapBounds, MapMarker, MarkerResponse, MarkerType } from '../types';

const STALE_TIME = 5 * 60 * 1000; // 5 minutos
const DEFAULT_LIMIT = 50;

interface UseMapMarkersOptions {
  bounds?: MapBounds;
  limitPerType?: number;
  enabled?: boolean;
}

interface UseMapMarkersReturn {
  markers: MapMarker[];
  businesses: MarkerResponse | undefined;
  attractions: MarkerResponse | undefined;
  events: MarkerResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  hasMore: { businesses: boolean; attractions: boolean; events: boolean };
  totals: { businesses: number; attractions: number; events: number };
}

/**
 * Hook para obtener todos los marcadores del mapa
 */
export function useMapMarkers(options: UseMapMarkersOptions = {}): UseMapMarkersReturn {
  const { bounds, limitPerType = DEFAULT_LIMIT, enabled = true } = options;

  const boundsKey = bounds
    ? `${bounds.north}-${bounds.south}-${bounds.east}-${bounds.west}`
    : 'all';

  const results = useQueries({
    queries: [
      {
        queryKey: ['map-markers', 'businesses', boundsKey, limitPerType],
        queryFn: () => getBusinessMarkers(bounds, limitPerType),
        staleTime: STALE_TIME,
        enabled,
      },
      {
        queryKey: ['map-markers', 'attractions', boundsKey, limitPerType],
        queryFn: () => getAttractionMarkers(bounds, limitPerType),
        staleTime: STALE_TIME,
        enabled,
      },
      {
        queryKey: ['map-markers', 'events', boundsKey, limitPerType],
        queryFn: () => getEventMarkers(bounds, limitPerType),
        staleTime: STALE_TIME,
        enabled,
      },
    ],
  });

  const [businessesQuery, attractionsQuery, eventsQuery] = results;

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  const markers: MapMarker[] = [
    ...(businessesQuery.data?.markers || []),
    ...(attractionsQuery.data?.markers || []),
    ...(eventsQuery.data?.markers || []),
  ];

  const refetch = () => {
    results.forEach((r) => r.refetch());
  };

  return {
    markers,
    businesses: businessesQuery.data,
    attractions: attractionsQuery.data,
    events: eventsQuery.data,
    isLoading,
    isError,
    refetch,
    hasMore: {
      businesses: businessesQuery.data?.hasMore ?? false,
      attractions: attractionsQuery.data?.hasMore ?? false,
      events: eventsQuery.data?.hasMore ?? false,
    },
    totals: {
      businesses: businessesQuery.data?.total ?? 0,
      attractions: attractionsQuery.data?.total ?? 0,
      events: eventsQuery.data?.total ?? 0,
    },
  };
}

/**
 * Hook para obtener marcadores de un tipo específico
 */
export function useMarkersByType(
  type: MarkerType,
  options: UseMapMarkersOptions = {},
): {
  data: MarkerResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} {
  const { bounds, limitPerType = DEFAULT_LIMIT, enabled = true } = options;

  const boundsKey = bounds
    ? `${bounds.north}-${bounds.south}-${bounds.east}-${bounds.west}`
    : 'all';

  const fetchFn = {
    business: getBusinessMarkers,
    attraction: getAttractionMarkers,
    event: getEventMarkers,
  }[type];

  const query = useQuery({
    queryKey: ['map-markers', type, boundsKey, limitPerType],
    queryFn: () => fetchFn(bounds, limitPerType),
    staleTime: STALE_TIME,
    enabled,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
