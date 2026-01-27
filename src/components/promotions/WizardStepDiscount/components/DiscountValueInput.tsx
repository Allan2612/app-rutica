import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { DiscountType } from '@/types/enums';
import { discountValueInputStyles as styles } from './styles';

interface DiscountValueInputProps {
  discountType: DiscountType;
  discountValue: number;
  onValueChange: (value: number) => void;
  error?: string;
}

export const DiscountValueInput = memo(function DiscountValueInput({
  discountType,
  discountValue,
  onValueChange,
  error,
}: DiscountValueInputProps) {
  const colors = useThemedColors();
  const isPercentage = discountType === 'percentage';

  return (
    <View style={formSectionStyles.section}>
      <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
        {isPercentage ? 'Porcentaje de descuento' : 'Monto de descuento (₡)'}{' '}
        <Text style={formSectionStyles.required}>*</Text>
      </Text>

      <View style={styles.inputWithUnit}>
        <TextInput
          style={[
            formSectionStyles.input,
            styles.input,
            {
              backgroundColor: colors.background.secondary,
              borderColor: error ? colors.error : colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={discountValue > 0 ? String(discountValue) : ''}
          onChangeText={(text) => {
            const numValue = parseFloat(text) || 0;
            onValueChange(numValue);
          }}
          placeholder={isPercentage ? 'Ej: 20' : 'Ej: 5000'}
          placeholderTextColor={colors.text.tertiary}
          keyboardType="numeric"
        />
        <View
          style={[
            styles.unitBadge,
            { backgroundColor: colors.background.tertiary },
          ]}
        >
          <Text style={[styles.unitText, { color: colors.text.secondary }]}>
            {isPercentage ? '%' : '₡'}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}

      {isPercentage && discountValue > 0 && (
        <Text style={[styles.helperText, { color: colors.text.secondary }]}>
          Los clientes recibirán un {discountValue}% de descuento
        </Text>
      )}
    </View>
  );
});
