import { useState, useCallback } from 'react';
import { LocationData } from './LocationPicker';

interface UseReverseGeocodeReturn {
  reverseGeocode: (lat: number, lng: number) => Promise<LocationData>;
  isLoading: boolean;
}

/**
 * Hook para geocodificación inversa usando Nominatim (OpenStreetMap)
 */
export function useReverseGeocode(): UseReverseGeocodeReturn {
  const [isLoading, setIsLoading] = useState(false);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<LocationData> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'es',
          },
        }
      );
      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;
        return {
          latitude: lat,
          longitude: lng,
          country: addr.country || '',
          province: addr.state || addr.province || '',
          canton: addr.county || addr.municipality || '',
          district: addr.city || addr.town || addr.village || '',
          address: data.display_name || '',
        };
      }
    } catch (error) {
      console.error('[GEOCODING] Error:', error);
    } finally {
      setIsLoading(false);
    }

    // Si falla, retornar solo coordenadas
    return {
      latitude: lat,
      longitude: lng,
    };
  }, []);

  return { reverseGeocode, isLoading };
}
