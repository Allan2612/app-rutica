import { memo, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMapLocation } from '@/features/maps/hooks';
import { generateMapHTML } from '@/features/maps/services';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const MapScreen = memo(function MapScreen() {
  const colors = useThemedColors();
  const { coordinates, loading, error, retry } = useMapLocation();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapHTML = useMemo(() => {
    if (!coordinates) return '';

    return generateMapHTML(coordinates.latitude, coordinates.longitude, {
      theme: colors.isDark ? 'dark' : 'light',
    });
  }, [coordinates, colors.isDark]);

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
          <Text style={[styles.buttonText, { color: colors.text.inverse }]}>🔄 Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading || !coordinates) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Preparando mapa...</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {!isMapLoaded && (
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
        onLoadEnd={() => setIsMapLoaded(true)}
        renderLoading={() => (
          <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Cargando mapa...</Text>
          </View>
        )}
      />
      {!isMapLoaded && (
        <View style={[styles.overlay, { backgroundColor: colors.background.primary }]}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}
    </View>
  );
});

export default MapScreen;
