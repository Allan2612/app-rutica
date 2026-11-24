import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface UseLocationResult {
  location: Location.LocationObject | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

interface UseUserLocationOptions {
  enabled?: boolean;
}

/**
 * Hook para manejar la obtención de ubicación del usuario
 * Solicita permisos y obtiene coordenadas actuales
 */
export function useUserLocation(options: UseUserLocationOptions = {}): UseLocationResult {
  const { enabled = true } = options;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let { status: currentStatus } = await Location.getForegroundPermissionsAsync();

      if (currentStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setError('Permiso de ubicación denegado');
          setLoading(false);
          return;
        }
      }

      // En web la consulta puede quedar esperando para siempre: cortar a los 10 s
      const currentLocation = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('No se pudo obtener tu ubicación a tiempo')), 10000),
        ),
      ]);

      setLocation(currentLocation);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error al obtener ubicación');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    requestLocation();
  }, [enabled, requestLocation]);

  return {
    location,
    loading,
    error,
    retry: requestLocation,
  };
}
