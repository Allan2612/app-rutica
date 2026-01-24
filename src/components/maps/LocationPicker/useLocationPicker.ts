import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { COSTA_RICA_CENTER } from '@/utils/geoHelpers';
import type { LocationData, LocationPickerProps } from './types';

const DEFAULT_LAT = COSTA_RICA_CENTER.latitude;
const DEFAULT_LNG = COSTA_RICA_CENTER.longitude;

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

    // Actualizar coordenadas cuando cambian las props iniciales
    useEffect(() => {
        if (initialLatitude !== undefined && initialLongitude !== undefined) {
            if (!hasInitializedFromProps.current) {
                setLatitude(initialLatitude);
                setLongitude(initialLongitude);
                setMapKey((prev) => prev + 1);
                hasInitializedFromProps.current = true;
            }
        }
    }, [initialLatitude, initialLongitude]);

    const getCurrentLocation = useCallback(async () => {
        setLoadingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Necesitamos tu ubicación para centrar el mapa'
                );
                setLoadingLocation(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const newLat = location.coords.latitude;
            const newLng = location.coords.longitude;

            setLatitude(newLat);
            setLongitude(newLng);
            setMapKey((prev) => prev + 1);

            onLocationSelect({
                latitude: newLat,
                longitude: newLng,
            });
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo obtener tu ubicación',
                position: 'top',
                visibilityTime: 3000,
            });
        } finally {
            setLoadingLocation(false);
        }
    }, [onLocationSelect]);

    const handleLocationChange = useCallback((data: LocationData) => {
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        onLocationSelect(data);
    }, [onLocationSelect]);

    const handleMapLoadEnd = useCallback(() => {
        setLoading(false);
    }, []);

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
