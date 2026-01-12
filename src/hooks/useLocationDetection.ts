import { useState, useCallback, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '@/store';

export interface LocationSelection {
  province: string | null;
  canton: string | null;
  district: string | null;
  searchText: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
}

/**
 * Hook para manejar la detección automática de ubicación GPS
 * Incluye geocodificación inversa y manejo de estado
 */
export function useLocationDetection(
  autoDetect: boolean,
  onLocationChange?: (selection: LocationSelection) => void
) {
  const { location: storedLocation, hasLocation } = useLocationStore();
  const hasDetectedLocation = useRef(false);
  
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCanton, setSelectedCanton] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [currentCoordinates, setCurrentCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  // Geocodificación inversa
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'es' },
        }
      );
      const data = await response.json();

      if (data?.address) {
        const addr = data.address;
        return {
          province: addr.state || addr.province || '',
          canton: addr.county || addr.municipality || '',
          district: addr.city || addr.town || addr.village || addr.suburb || '',
          address: data.display_name || '',
        };
      }
    } catch (error) {
      // Geocoding puede fallar, no es crítico
      return null;
    }
    return null;
  }, []);

  // Obtener ubicación GPS
  const getCurrentLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLoadingLocation(false);
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentCoordinates(coords);

      const geoData = await reverseGeocode(coords.latitude, coords.longitude);
      
      if (geoData?.province) setSelectedProvince(geoData.province);
      if (geoData?.canton) setSelectedCanton(geoData.canton);
      if (geoData?.district) setSelectedDistrict(geoData.district);
      
      const newSelection: LocationSelection = {
        province: geoData?.province || null,
        canton: geoData?.canton || null,
        district: geoData?.district || null,
        searchText: '',
        coordinates: coords,
        address: geoData?.address,
      };

      onLocationChange?.(newSelection);
      
      return newSelection;
    } catch (error) {
      console.error('[LOCATION] Error:', error);
      return null;
    } finally {
      setLoadingLocation(false);
    }
  }, [reverseGeocode, onLocationChange]);

  // Inicializar con ubicación del store
  useEffect(() => {
    if (storedLocation && hasLocation) {
      setSelectedProvince(storedLocation.province);
      setSelectedCanton(storedLocation.canton);
      setSelectedDistrict(storedLocation.district);
      setCurrentCoordinates(storedLocation.coordinates || null);
      hasDetectedLocation.current = true;
    }
  }, [storedLocation, hasLocation]);

  // Detectar automáticamente solo la primera vez
  useEffect(() => {
    if (autoDetect && !hasLocation && !hasDetectedLocation.current) {
      hasDetectedLocation.current = true;
      getCurrentLocation();
    }
  }, [autoDetect, hasLocation, getCurrentLocation]);

  return {
    loadingLocation,
    selectedProvince,
    selectedCanton,
    selectedDistrict,
    currentCoordinates,
    getCurrentLocation,
    setSelectedProvince,
    setSelectedCanton,
    setSelectedDistrict,
    setCurrentCoordinates,
  };
}
