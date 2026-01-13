import { useEffect, useMemo } from 'react';
import { useLocationStore } from '@/store';
import { useUserLocation } from './useUserLocation';

interface UseMapLocationOptions {
  enableAutoDetect?: boolean;
}

export function useMapLocation(options: UseMapLocationOptions = {}) {
  const { enableAutoDetect = true } = options;
  const { location: storedLocation, hasCoordinates, updatePartialLocation } = useLocationStore();

  const shouldDetect = enableAutoDetect && !hasCoordinates;

  const { location: detectedLocation, loading: detecting, error, retry } = useUserLocation({
    enabled: shouldDetect,
  });

  const coordinates = useMemo(() => {
    if (storedLocation?.coordinates) {
      return storedLocation.coordinates;
    }

    if (detectedLocation?.coords) {
      return {
        latitude: detectedLocation.coords.latitude,
        longitude: detectedLocation.coords.longitude,
      } as const;
    }

    return null;
  }, [storedLocation?.coordinates, detectedLocation]);

  useEffect(() => {
    if (!hasCoordinates && detectedLocation?.coords) {
      updatePartialLocation({
        coordinates: {
          latitude: detectedLocation.coords.latitude,
          longitude: detectedLocation.coords.longitude,
        },
      });
    }
  }, [detectedLocation, hasCoordinates, updatePartialLocation]);

  return {
    coordinates,
    loading: !coordinates && shouldDetect ? detecting : false,
    error: coordinates ? null : error,
    retry,
  } as const;
}
