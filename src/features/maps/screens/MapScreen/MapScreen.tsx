import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { router } from 'expo-router';
import { useMapLocation, useMapMarkers } from '@/features/maps/hooks';
import { generateExploreMapHTML, MapFilterChips } from '@/components/maps';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import type { MarkerType } from '@/features/maps/types';
import { MapLoading, MapError, MapOverlay } from './MapStates';
import { styles } from './styles';

const ALL_MARKER_TYPES: MarkerType[] = ['attraction', 'event', 'business'];

export const MapScreen = memo(function MapScreen() {
  const colors = useThemedColors();
  const { coordinates, loading, error, retry } = useMapLocation();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<MarkerType[]>(ALL_MARKER_TYPES);
  const [showUserLocation, setShowUserLocation] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { markers, isLoading: markersLoading, refetch } = useMapMarkers({
    limitPerType: 500,
    enabled: !!coordinates,
  });

  // Refrescar marcadores cuando la pantalla recibe foco
  useRefreshOnFocus(refetch);

  const initialMarkersRef = useRef<typeof markers>([]);

  useEffect(() => {
    if (!markersLoading && markers.length > 0 && initialMarkersRef.current.length === 0) {
      initialMarkersRef.current = markers;
    }
  }, [markers, markersLoading]);

  const allMarkers = initialMarkersRef.current.length > 0
    ? initialMarkersRef.current
    : (!markersLoading ? markers : []);

  // Enviar mensaje al mapa para actualizar filtros
  const updateMapFilters = useCallback((types: MarkerType[], showUser: boolean) => {
    const message = JSON.stringify({
      type: 'updateFilters',
      selectedTypes: types,
      showUserLocation: showUser,
    });

    if (Platform.OS === 'web') {
      iframeRef.current?.contentWindow?.postMessage(message, '*');
    } else {
      webViewRef.current?.postMessage(message);
    }
  }, []);

  const handleToggleType = useCallback((type: MarkerType) => {
    setSelectedTypes(prev => {
      const newTypes = prev.includes(type)
        ? (prev.length === 1 ? prev : prev.filter(t => t !== type))
        : [...prev, type];

      // Actualizar mapa sin recargar
      if (isMapLoaded) {
        updateMapFilters(newTypes, showUserLocation);
      }

      return newTypes;
    });
  }, [isMapLoaded, showUserLocation, updateMapFilters]);

  const handleToggleUserLocation = useCallback(() => {
    setShowUserLocation(prev => {
      const newValue = !prev;

      // Actualizar mapa sin recargar
      if (isMapLoaded) {
        updateMapFilters(selectedTypes, newValue);
      }

      return newValue;
    });
  }, [isMapLoaded, selectedTypes, updateMapFilters]);

  // Generar HTML solo una vez con TODOS los marcadores
  const mapHTML = useMemo(() => {
    if (!coordinates || allMarkers.length === 0) return '';
    return generateExploreMapHTML({
      userLatitude: coordinates.latitude,
      userLongitude: coordinates.longitude,
      markers: allMarkers,
      theme: colors.isDark ? 'dark' : 'light',
      zoom: 13,
      showUserMarker: showUserLocation,
      initialSelectedTypes: selectedTypes,
    });
  }, [coordinates, allMarkers, colors.isDark]);

  const handleMessage = useCallback((event: WebViewMessageEvent | MessageEvent) => {
    try {
      const rawData = 'nativeEvent' in event ? event.nativeEvent.data : event.data;
      const data = JSON.parse(rawData);
      if (data.type === 'navigate' && data.route) {
        router.push(data.route as any);
      }
    } catch { }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleWindowMessage = (event: MessageEvent) => handleMessage(event);
    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [handleMessage]);

  if (error && !coordinates) return <MapError error={error} onRetry={retry} />;
  if (loading || !coordinates || (markersLoading && allMarkers.length === 0)) {
    return <MapLoading message={markersLoading ? 'Cargando marcadores...' : 'Preparando mapa...'} />;
  }

  const showOverlay = !isMapLoaded || markersLoading;

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <MapFilterChips
          selectedTypes={selectedTypes}
          onToggle={handleToggleType}
          showUserLocation={showUserLocation}
          onToggleUserLocation={handleToggleUserLocation}
        />
        <View style={styles.mapContainer}>
          <MapOverlay visible={showOverlay} />
          <iframe
            ref={iframeRef}
            srcDoc={mapHTML}
            style={{ width: '100%', height: '100%', border: 0, flex: 1 }}
            onLoad={() => setIsMapLoaded(true)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapFilterChips
        selectedTypes={selectedTypes}
        onToggle={handleToggleType}
        showUserLocation={showUserLocation}
        onToggleUserLocation={handleToggleUserLocation}
      />
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
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
              <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Cargando mapa...</Text>
            </View>
          )}
        />
        <MapOverlay visible={showOverlay} />
      </View>
    </View>
  );
});

export default MapScreen;
