import { memo } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface MapLoadingProps {
  message: string;
}

export const MapLoading = memo(function MapLoading({ message }: MapLoadingProps) {
  const colors = useThemedColors();

  return (
    <View style={[styles.centerContainer, { backgroundColor: colors.background.primary }]}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
      <Text style={[styles.loadingText, { color: colors.text.secondary }]}>{message}</Text>
    </View>
  );
});

interface MapErrorProps {
  error: string;
  onRetry: () => void;
}

export const MapError = memo(function MapError({ error, onRetry }: MapErrorProps) {
  const colors = useThemedColors();

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
        onPress={onRetry}
      >
        <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
});

interface MapOverlayProps {
  visible: boolean;
}

export const MapOverlay = memo(function MapOverlay({ visible }: MapOverlayProps) {
  const colors = useThemedColors();

  if (!visible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background.primary }]}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
});

/** Aviso no bloqueante: el mapa se muestra igual, centrado en la zona elegida o en Costa Rica. */
export const MapLocationNotice = memo(function MapLocationNotice({
  onRetry,
}: {
  onRetry: () => void;
}) {
  const colors = useThemedColors();
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 32,
        left: 8,
        right: 8,
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderRadius: 10,
        backgroundColor: colors.background.primary,
        borderWidth: 1,
        borderColor: colors.border.light,
      }}
    >
      <Text style={{ flex: 1, fontSize: 13, color: colors.text.secondary }}>
        Sin permiso de ubicación: el mapa muestra la zona elegida o Costa Rica.
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Reintentar ubicación"
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: colors.primary[500],
        }}
      >
        <Text style={{ color: colors.text.inverse, fontWeight: '600', fontSize: 13 }}>
          Reintentar
        </Text>
      </TouchableOpacity>
    </View>
  );
});
