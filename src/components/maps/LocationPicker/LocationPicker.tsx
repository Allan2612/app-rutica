import { memo, useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { generateMapHTML } from '@/components/maps/LeafletMap';
import { styles } from './styles';
import { useLocationPicker } from './useLocationPicker';
import { LocationPickerHeader } from './LocationPickerHeader';
import { LocationPickerMap } from './LocationPickerMap';
import type { LocationPickerProps } from './types';

export type { LocationData, LocationPickerProps } from './types';

/**
 * Componente para seleccionar ubicación en un mapa interactivo
 */
export const LocationPicker = memo(function LocationPicker({
  initialLatitude,
  initialLongitude,
  onLocationSelect,
  height = 400,
}: LocationPickerProps) {
  const colors = useThemedColors();

  const {
    latitude,
    longitude,
    loading,
    loadingLocation,
    mapKey,
    getCurrentLocation,
    handleLocationChange,
    handleMapLoadEnd,
  } = useLocationPicker({
    initialLatitude,
    initialLongitude,
    onLocationSelect,
  });

  const mapHTML = useMemo(
    () =>
      generateMapHTML(latitude, longitude, {
        theme: colors.isDark ? 'dark' : 'light',
      }),
    [latitude, longitude, colors.isDark],
  );

  return (
    <View
      style={[
        styles.container,
        {
          height,
          borderColor: colors.border.light,
          backgroundColor: colors.background.tertiary,
        },
      ]}
    >
      <LocationPickerHeader onGetLocation={getCurrentLocation} isLoading={loadingLocation} />

      {loading && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)' },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}

      <LocationPickerMap
        mapKey={mapKey}
        mapHTML={mapHTML}
        onLocationChange={handleLocationChange}
        onLoadEnd={handleMapLoadEnd}
      />

      <Text
        style={[
          styles.hint,
          {
            backgroundColor: colors.isDark ? colors.background.tertiary : colors.primary[50],
            color: colors.text.secondary,
          },
        ]}
      >
        Arrastra el pin o haz clic en el mapa para cambiar la ubicación
      </Text>
    </View>
  );
});
