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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'es',
            'User-Agent': 'RuticaApp/1.0 (Costa Rica Tourism)',
          },
        }
      );
      clearTimeout(timeoutId);
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
    } catch (error: any) {
      const errorMessage = error?.name === 'AbortError' 
        ? 'Timeout al obtener ubicación (> 8s)'
        : error?.message || 'Error desconocido en geocodificación';
      console.error('[GEOCODING] Error:', errorMessage);
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
