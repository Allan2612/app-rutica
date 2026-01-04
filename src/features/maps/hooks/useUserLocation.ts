import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface UseLocationResult {
  location: Location.LocationObject | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Hook para manejar la obtención de ubicación del usuario
 * Solicita permisos y obtiene coordenadas actuales
 */
export function useUserLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('[LOCATION] Solicitando permisos...');

      let { status: currentStatus } = await Location.getForegroundPermissionsAsync();
      console.log('[LOCATION] Estado actual:', currentStatus);

      if (currentStatus !== 'granted') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('[LOCATION] Resultado solicitud:', status);

        if (status !== 'granted') {
          setError('Permiso de ubicación denegado');
          setLoading(false);
          return;
        }
      }

      console.log('[LOCATION] Obteniendo posición...');
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log('[LOCATION] Ubicación obtenida:', currentLocation.coords);
      setLocation(currentLocation);
      setLoading(false);
    } catch (err: any) {
      console.error('[LOCATION] Error:', err);
      setError(err.message || 'Error al obtener ubicación');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    loading,
    error,
    retry: requestLocation,
  };
}
