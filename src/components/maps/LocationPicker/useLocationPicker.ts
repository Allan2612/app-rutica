import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { COSTA_RICA_CENTER } from '@/utils/geoHelpers';
import { useReverseGeocode } from './useReverseGeocode';
import type { LocationData, LocationPickerProps } from './types';

// Constantes
const DEFAULT_LAT = COSTA_RICA_CENTER.latitude;
const DEFAULT_LNG = COSTA_RICA_CENTER.longitude;
const DEBOUNCE_DELAY = 500;
const PROCESSING_RELEASE_DELAY = 100;
const TOAST_VISIBILITY = 4000;

// Mensajes
const MESSAGES = {
  PERMISSION_DENIED: {
    title: 'Permiso denegado',
    message: 'Necesitamos tu ubicación para centrar el mapa',
  },
  LOCATION_ERROR: {
    title: 'Error',
    message: 'No se pudo obtener tu ubicación',
  },
  INCOMPLETE_LOCATION: {
    title: 'Ubicación incompleta',
    message: 'Intenta seleccionar un punto más específico (ciudad, distrito o pueblo)',
  },
  INVALID_LOCATION: {
    title: 'Ubicación no válida',
  },
} as const;

/**
 * Hook que encapsula la lógica del LocationPicker
 */
export function useLocationPicker({
  initialLatitude,
  initialLongitude,
  onLocationSelect,
}: Omit<LocationPickerProps, 'height'>) {
  const [latitude, setLatitude] = useState(initialLatitude ?? DEFAULT_LAT);
  const [longitude, setLongitude] = useState(initialLongitude ?? DEFAULT_LNG);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const hasInitializedFromProps = useRef(false);
  const hasRequestedAutoLocation = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);
  const { reverseGeocode } = useReverseGeocode();

  const getCurrentLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(MESSAGES.PERMISSION_DENIED.title, MESSAGES.PERMISSION_DENIED.message);
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLat = location.coords.latitude;
      const newLng = location.coords.longitude;

      setLatitude(newLat);
      setLongitude(newLng);
      setMapKey((prev) => prev + 1);

      try {
        const geoData = await reverseGeocode(newLat, newLng);
        onLocationSelect(geoData);
      } catch {
        onLocationSelect({
          latitude: newLat,
          longitude: newLng,
        });
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: MESSAGES.LOCATION_ERROR.title,
        text2: MESSAGES.LOCATION_ERROR.message,
        position: 'top',
        visibilityTime: TOAST_VISIBILITY,
      });
    } finally {
      setLoadingLocation(false);
    }
  }, [onLocationSelect, reverseGeocode]);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Actualizar coordenadas cuando cambian las props iniciales
  // O obtener ubicación actual si no hay coordenadas iniciales
  useEffect(() => {
    if (initialLatitude !== undefined && initialLongitude !== undefined) {
      // Tiene coordenadas guardadas (edit) - usar esas SIEMPRE (aunque tarde en llegar)
      if (!hasInitializedFromProps.current) {
        setLatitude(initialLatitude);
        setLongitude(initialLongitude);
        setMapKey((prev) => prev + 1);
        hasInitializedFromProps.current = true;
        hasRequestedAutoLocation.current = true; // Marcar para no pedir ubicación actual después
      }
    } else if (!hasInitializedFromProps.current && !hasRequestedAutoLocation.current) {
      // No tiene coordenadas (create) - esperar para asegurarse que no llegarán
      const timeoutId = setTimeout(() => {
        // Solo pedir ubicación si después del delay todavía no hay coordenadas
        if (
          initialLatitude === undefined &&
          initialLongitude === undefined &&
          !hasRequestedAutoLocation.current
        ) {
          hasRequestedAutoLocation.current = true;
          getCurrentLocation();
        }
      }, 500); // Aumentado a 500ms para dar más tiempo

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLatitude, initialLongitude]);

  const handleLocationChange = useCallback(
    async (data: LocationData) => {
      setLatitude(data.latitude);
      setLongitude(data.longitude);

      if (isProcessingRef.current) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        isProcessingRef.current = true;

        try {
          const geoData = await reverseGeocode(data.latitude, data.longitude);

          const hasRequiredFields = !!(
            geoData.country &&
            geoData.province &&
            geoData.canton &&
            geoData.district
          );

          if (!hasRequiredFields) {
            Toast.show({
              type: 'info',
              text1: MESSAGES.INCOMPLETE_LOCATION.title,
              text2: MESSAGES.INCOMPLETE_LOCATION.message,
              position: 'top',
              visibilityTime: TOAST_VISIBILITY,
            });
          }

          onLocationSelect(geoData);
        } catch (error: any) {
          if (error?.message?.includes('debe estar en Costa Rica')) {
            Toast.show({
              type: 'error',
              text1: MESSAGES.INVALID_LOCATION.title,
              text2: error.message,
              position: 'top',
              visibilityTime: TOAST_VISIBILITY,
            });
          } else {
            onLocationSelect(data);
          }
        } finally {
          setTimeout(() => {
            isProcessingRef.current = false;
          }, PROCESSING_RELEASE_DELAY);
        }
      }, DEBOUNCE_DELAY);
    },
    [onLocationSelect, reverseGeocode],
  );

  const handleMapLoadEnd = useCallback(() => setLoading(false), []);

  return {
    latitude,
    longitude,
    loading,
    loadingLocation,
    mapKey,
    getCurrentLocation,
    handleLocationChange,
    handleMapLoadEnd,
  };
}
