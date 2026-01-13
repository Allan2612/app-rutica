import { memo } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useUserLocation } from '@/features/maps/hooks';
import { generateMapHTML, generateGoogleMapsURL } from '@/features/maps/services';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const MapScreen = memo(function MapScreen() {
  const { location, loading, error, retry } = useUserLocation();
  const colors = useThemedColors();

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  if (error || !location) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.error[500] }]}>
          {error || 'No se pudo obtener la ubicación'}
        </Text>
        <Text style={[styles.helpText, { color: colors.text.secondary }]}>
          {Platform.OS === 'web'
            ? 'Asegúrate de permitir el acceso a la ubicación en tu navegador'
            : 'Verifica que los permisos de ubicación estén habilitados en la configuración de la app'}
        </Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary[500] }]} onPress={retry}>
          <Text style={[styles.buttonText, { color: colors.text.inverse }]}>🔄 Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { latitude, longitude } = location.coords;

  // Vista para Web con iframe de Google Maps
  if (Platform.OS === 'web') {
    const mapUrl = generateGoogleMapsURL(latitude, longitude);

    return (
      <View style={styles.container}>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
        />
        <View style={[
          styles.webInfoCard,
          { backgroundColor: colors.isDark ? colors.background.primary : 'rgba(255, 255, 255, 0.95)' }
        ]}>
          <Text style={[styles.infoText, { color: colors.text.primary }]}>
            📍 Lat: {latitude.toFixed(6)} | Long: {longitude.toFixed(6)}
          </Text>
        </View>
      </View>
    );
  }

  // Vista para iOS/Android con WebView y Leaflet
  const mapHTML = generateMapHTML(latitude, longitude);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHTML }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Cargando mapa...</Text>
          </View>
        )}
      />
      <View style={[
        styles.mobileInfoCard,
        { backgroundColor: colors.isDark ? colors.background.primary : 'rgba(255, 255, 255, 0.95)' }
      ]}>
        <Text style={[styles.infoText, { color: colors.text.primary }]}>
          📍 Lat: {latitude.toFixed(6)} | Long: {longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
});

export default MapScreen;
