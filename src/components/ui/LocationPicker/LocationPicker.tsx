import { memo, useEffect, useState, useCallback, useMemo, useRef } from 'react';
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
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { isWithinCostaRica, COSTA_RICA_CENTER } from '@/utils/geoHelpers';
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

// Coordenadas por defecto: Centro de Costa Rica
const DEFAULT_LAT = COSTA_RICA_CENTER.latitude;
const DEFAULT_LNG = COSTA_RICA_CENTER.longitude;

export const LocationPicker = memo(function LocationPicker({
  initialLatitude,
  initialLongitude,
  onLocationSelect,
  height = 400,
}: LocationPickerProps) {
  // Usar las coordenadas iniciales si están disponibles, sino usar default de Costa Rica
  const [latitude, setLatitude] = useState(initialLatitude ?? DEFAULT_LAT);
  const [longitude, setLongitude] = useState(initialLongitude ?? DEFAULT_LNG);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Key para forzar re-render del mapa
  const hasInitializedFromProps = useRef(false);
  const colors = useThemedColors();

  const { reverseGeocode, isLoading: loadingAddress, error: geocodeError } = useReverseGeocode();

  // Actualizar coordenadas cuando cambian las props iniciales (ej: cuando se cargan datos del negocio)
  useEffect(() => {
    if (initialLatitude !== undefined && initialLongitude !== undefined) {
      // Solo actualizar si no hemos inicializado o las coordenadas cambiaron
      if (!hasInitializedFromProps.current) {
        setLatitude(initialLatitude);
        setLongitude(initialLongitude);
        setMapKey((prev) => prev + 1); // Forzar re-render del mapa con nuevas coordenadas
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

      // Solo enviar coordenadas (dirección se obtiene al guardar)
      setLatitude(newLat);
      setLongitude(newLng);
      setMapKey((prev) => prev + 1);
      
      onLocationSelect({
        latitude: newLat,
        longitude: newLng,
      });
    } catch (error) {
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
  }, [reverseGeocode, onLocationSelect]);

  const mapHTML = useMemo(
    () =>
      generateMapHTML(latitude, longitude, {
        theme: colors.isDark ? 'dark' : 'light',
      }),
    [latitude, longitude, colors.isDark]
  );

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        
        // Manejar mensajes de error (ubicación fuera de Costa Rica)
        if (data.error) {
          Toast.show({
            type: 'error',
            text1: 'Ubicación no válida',
            text2: data.error,
            position: 'top',
            visibilityTime: 3000,
          });
          return;
        }
        
        if (data.latitude && data.longitude) {
          // Validar que esté dentro de Costa Rica (coordenadas)
          if (!isWithinCostaRica(data.latitude, data.longitude)) {
            Toast.show({
              type: 'error',
              text1: 'Ubicación no válida',
              text2: 'La ubicación debe estar dentro de Costa Rica',
              position: 'top',
              visibilityTime: 3000,
            });
            return;
          }
          
          // Solo enviar coordenadas (dirección se obtiene al guardar)
          setLatitude(data.latitude);
          setLongitude(data.longitude);
          
          onLocationSelect({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      } catch (error) {
        // Error parsing message
      }
    },
    [reverseGeocode, onLocationSelect]
  );

  // Usar Leaflet interactivo en todas las plataformas (web y mobile)
  return (
    <View style={[
      styles.container, 
      { 
        height,
        borderColor: colors.border.light,
        backgroundColor: colors.background.tertiary,
      }
    ]}>
      <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.headerText, { color: colors.text.primary }]}>
          Mueve el pin a la ubicación del negocio
        </Text>
        <Pressable
          style={styles.button}
          onPress={getCurrentLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.buttonText}>
            {loadingLocation ? 'Obteniendo...' : 'Mi ubicación'}
          </Text>
        </Pressable>
      </View>

      {loadingAddress && (
        <View style={[
          styles.loadingAddressBar,
          { 
            backgroundColor: colors.primary[50],
            borderBottomColor: colors.border.light,
          }
        ]}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={[styles.loadingAddressText, { color: colors.info }]}>Obteniendo dirección...</Text>
        </View>
      )}

      {loading && (
        <View style={[
          styles.loadingOverlay,
          { backgroundColor: colors.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)' }
        ]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}

      {Platform.OS === 'web' ? (
        // En web: renderizar HTML directamente
        <iframe
          key={mapKey}
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
                
                // Manejar mensajes de error (ubicación fuera de Costa Rica)
                if (data.error) {
                  Toast.show({
                    type: 'error',
                    text1: 'Ubicación no válida',
                    text2: data.error,
                    position: 'top',
                    visibilityTime: 3000,
                  });
                  return;
                }
                
                if (data.latitude && data.longitude) {
                  // Validar que esté dentro de Costa Rica (coordenadas)
                  if (!isWithinCostaRica(data.latitude, data.longitude)) {
                    Toast.show({
                      type: 'error',
                      text1: 'Ubicación no válida',
                      text2: 'La ubicación debe estar dentro de Costa Rica',
                      position: 'top',
                      visibilityTime: 3000,
                    });
                    return;
                  }
                  
                  // Solo enviar coordenadas (dirección se obtiene al guardar)
                  setLatitude(data.latitude);
                  setLongitude(data.longitude);
                  
                  onLocationSelect({
                    latitude: data.latitude,
                    longitude: data.longitude,
                  });
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
          key={mapKey}
          source={{ html: mapHTML }}
          style={styles.webview}
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
        />
      )}

      <Text style={[
        styles.hint, 
        { 
          backgroundColor: colors.isDark ? colors.background.tertiary : colors.primary[50],
          color: colors.text.secondary,
        }
      ]}>
        Arrastra el pin o haz clic en el mapa para cambiar la ubicación
      </Text>
    </View>
  );
});
