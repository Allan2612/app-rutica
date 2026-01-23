import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { router } from 'expo-router';
import { useMapLocation, useMapMarkers } from '@/features/maps/hooks';
import { generateExploreMapHTML } from '@/components/maps';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const MapScreen = memo(function MapScreen() {
  const colors = useThemedColors();
  const { coordinates, loading, error, retry } = useMapLocation();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Cargar marcadores una sola vez (sin bounds para evitar regenerar el mapa)
  const { markers, isLoading: markersLoading } = useMapMarkers({
    limitPerType: 500,
    enabled: !!coordinates,
  });

  // Guardar marcadores iniciales para no regenerar el mapa después
  const initialMarkersRef = useRef<typeof markers>([]);

  // Solo actualizar ref cuando TODAS las queries terminan por primera vez
  useEffect(() => {
    if (!markersLoading && markers.length > 0 && initialMarkersRef.current.length === 0) {
      initialMarkersRef.current = markers;
    }
  }, [markers, markersLoading]);

  // Usar los marcadores del ref si existen, sino los actuales (solo cuando ya no está cargando)
  const markersToUse = initialMarkersRef.current.length > 0
    ? initialMarkersRef.current
    : (!markersLoading ? markers : []);

  const handleMessage = useCallback((event: WebViewMessageEvent | MessageEvent) => {
    try {
      const rawData = 'nativeEvent' in event ? event.nativeEvent.data : event.data;
      const data = JSON.parse(rawData);

      if (data.type === 'navigate' && data.route) {
        router.push(data.route as any);
      }
      // Ignoramos boundsChanged para evitar regenerar el mapa
    } catch { }
  }, []);

  // Listener para mensajes del iframe en Web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleWindowMessage = (event: MessageEvent) => {
      handleMessage(event);
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [handleMessage]);

  // Solo generar HTML cuando tenemos coordenadas y marcadores
  const mapHTML = useMemo(() => {
    if (!coordinates || markersToUse.length === 0) return '';

    return generateExploreMapHTML({
      userLatitude: coordinates.latitude,
      userLongitude: coordinates.longitude,
      markers: markersToUse,
      theme: colors.isDark ? 'dark' : 'light',
      zoom: 13,
    });
  }, [coordinates, markersToUse, colors.isDark]);

  if (error && !coordinates) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.error[500] }]}>{error}</Text>
        <Text style={[styles.helpText, { color: colors.text.secondary }]}>
          {Platform.OS === 'web'
            ? 'Selecciona una ubicación global desde el selector o habilita permisos en el navegador'
            : 'Selecciona una ubicación global desde el selector o habilita permisos de ubicación en la app'}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary[500] }]}
          onPress={retry}
        >
          <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading || !coordinates || (markersLoading && markersToUse.length === 0)) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          {markersLoading ? 'Cargando marcadores...' : 'Preparando mapa...'}
        </Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {(!isMapLoaded || markersLoading) && (
          <View style={[styles.overlay, { backgroundColor: colors.background.primary }]}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        )}
        <iframe
          srcDoc={mapHTML}
          style={{ width: '100%', height: '100%', border: 0, flex: 1 }}
          onLoad={() => setIsMapLoaded(true)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onMessage={handleMessage}
        onLoadEnd={() => setIsMapLoaded(true)}
        renderLoading={() => (
          <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Cargando mapa...</Text>
          </View>
        )}
      />
      {(!isMapLoaded || markersLoading) && (
        <View style={[styles.overlay, { backgroundColor: colors.background.primary }]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}
    </View>
  );
});

export default MapScreen;
