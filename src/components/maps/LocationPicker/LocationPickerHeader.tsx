import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface LocationPickerHeaderProps {
  onGetLocation: () => void;
  isLoading: boolean;
}

/**
 * Header del LocationPicker con botón de ubicación actual
 */
export const LocationPickerHeader = memo(function LocationPickerHeader({
  onGetLocation,
  isLoading,
}: LocationPickerHeaderProps) {
  const colors = useThemedColors();

  return (
    <View style={[styles.header, { backgroundColor: colors.background.primary }]}>
      <Text style={[styles.headerText, { color: colors.text.primary }]}>
        Mueve el pin a la ubicación del negocio
      </Text>
      <Pressable style={styles.button} onPress={onGetLocation} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Obteniendo...' : 'Mi ubicación'}</Text>
      </Pressable>
    </View>
  );
});
