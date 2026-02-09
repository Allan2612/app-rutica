import { memo } from 'react';
import { View, Text, TextInput, Switch } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface EventPricingSectionProps {
  isFree: boolean;
  price: string;
  capacity: string;
  onIsFreeChange: (value: boolean) => void;
  onPriceChange: (text: string) => void;
  onCapacityChange: (text: string) => void;
}

export const EventPricingSection = memo(function EventPricingSection({
  isFree,
  price,
  capacity,
  onIsFreeChange,
  onPriceChange,
  onCapacityChange,
}: EventPricingSectionProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Precio y Capacidad</Text>

      <View style={styles.switchRow}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Evento Gratuito</Text>
          <Text style={[styles.hint, { color: colors.text.secondary }]}>
            Activa si el evento no tiene costo
          </Text>
        </View>
        <Switch
          value={isFree}
          onValueChange={onIsFreeChange}
          trackColor={{ false: colors.border.medium, true: colors.primary[300] }}
          thumbColor={isFree ? colors.primary[500] : colors.background.primary}
        />
      </View>

      {!isFree && (
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Precio (₡ CRC)</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.medium,
                color: colors.text.primary,
              },
            ]}
            value={price}
            onChangeText={onPriceChange}
            placeholder="0"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text.primary }]}>Capacidad (Opcional)</Text>
        <Text style={[styles.hint, { color: colors.text.secondary }]}>
          Número máximo de asistentes
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={capacity}
          onChangeText={onCapacityChange}
          placeholder="Sin límite"
          placeholderTextColor={colors.text.tertiary}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
});
