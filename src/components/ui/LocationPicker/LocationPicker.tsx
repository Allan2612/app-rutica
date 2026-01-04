import { memo, useEffect, useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { styles } from './styles';
import { generateMapHTML } from './mapTemplate';
import { useReverseGeocode } from './useReverseGeocode';

export interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  province?: string;
  canton?: string;
  district?: string;
  address?: string;
}

export interface LocationPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationSelect: (data: LocationData) => void;
  height?: number;
}

export const LocationPicker = memo(function LocationPicker({
  initialLatitude,
  initialLongitude,
  onLocationSelect,
  height = 400,
}: LocationPickerProps) {
  const [latitude, setLatitude] = useState(initialLatitude || 9.9281); // Default Costa Rica
  const [longitude, setLongitude] = useState(initialLongitude || -84.0907);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const { reverseGeocode, isLoading: loadingAddress } = useReverseGeocode();

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

      // Obtener dirección y notificar al padre
      const locationData = await reverseGeocode(newLat, newLng);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('[LOCATION PICKER] Error getting location:', error);
    } finally {
      setLoadingLocation(false);
    }
  }, [reverseGeocode, onLocationSelect]);

  useEffect(() => {
    if (!initialLatitude && !initialLongitude) {
      getCurrentLocation();
    }
  }, []);

  const mapHTML = useMemo(() => generateMapHTML(latitude, longitude), [latitude, longitude]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.latitude && data.longitude) {
          setLatitude(data.latitude);
          setLongitude(data.longitude);

          // Obtener dirección automáticamente
          reverseGeocode(data.latitude, data.longitude).then((locationData) => {
            onLocationSelect(locationData);
          });
        }
      } catch (error) {
        console.error('[LOCATION PICKER] Error parsing message:', error);
      }
    },
    [reverseGeocode, onLocationSelect]
  );

  // Usar Leaflet interactivo en todas las plataformas (web y mobile)
  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Mueve el pin a la ubicación del negocio
        </Text>
        <Pressable
          style={styles.button}
          onPress={getCurrentLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.buttonText}>
            {loadingLocation ? 'Obteniendo...' : '📍 Mi ubicación'}
          </Text>
        </Pressable>
      </View>

      {loadingAddress && (
        <View style={styles.loadingAddressBar}>
          <ActivityIndicator size="small" color="#10b981" />
          <Text style={styles.loadingAddressText}>Obteniendo dirección...</Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      )}

      {Platform.OS === 'web' ? (
        // En web: renderizar HTML directamente
        <iframe
          srcDoc={mapHTML}
          style={{
            width: '100%',
            height: '100%',
            border: 0,
            flex: 1,
          }}
          onLoad={(e: any) => {
            setLoading(false);
            // Escuchar mensajes del iframe
            window.addEventListener('message', (event) => {
              try {
                const data = JSON.parse(event.data);
                if (data.latitude && data.longitude) {
                  setLatitude(data.latitude);
                  setLongitude(data.longitude);

                  // Obtener dirección automáticamente
                  reverseGeocode(data.latitude, data.longitude).then(
                    (locationData) => {
                      onLocationSelect(locationData);
                    }
                  );
                }
              } catch (error) {
                // Ignorar mensajes no JSON
              }
            });
          }}
        />
      ) : (
        // En mobile: usar WebView
        <WebView
          source={{ html: mapHTML }}
          style={styles.webview}
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
        />
      )}

      <Text style={styles.hint}>
        💡 Arrastra el pin o haz clic en el mapa para cambiar la ubicación
      </Text>
    </View>
  );
});
