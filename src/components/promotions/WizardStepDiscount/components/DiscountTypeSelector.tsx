import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Percent, DollarSign, Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { DiscountType } from '@/types/enums';
import { discountTypeSelectorStyles as styles } from './styles';

interface DiscountTypeOption {
  value: DiscountType;
  label: string;
  icon: typeof Percent;
}

const DISCOUNT_TYPES: DiscountTypeOption[] = [
  {
    value: 'percentage',
    label: 'Porcentaje',
    icon: Percent,
  },
  {
    value: 'fixed',
    label: 'Monto fijo',
    icon: DollarSign,
  },
];

interface DiscountTypeSelectorProps {
  selectedType: DiscountType;
  onTypeChange: (type: DiscountType) => void;
}

export const DiscountTypeSelector = memo(function DiscountTypeSelector({
  selectedType,
  onTypeChange,
}: DiscountTypeSelectorProps) {
  const colors = useThemedColors();

  return (
    <View style={formSectionStyles.section}>
      <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
        Tipo de descuento <Text style={formSectionStyles.required}>*</Text>
      </Text>

      <View style={styles.row}>
        {DISCOUNT_TYPES.map((type) => {
          const isSelected = selectedType === type.value;
          const Icon = type.icon;

          return (
            <Pressable
              key={type.value}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected
                    ? colors.primary[500]
                    : colors.background.secondary,
                  borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                },
              ]}
              onPress={() => onTypeChange(type.value)}
            >
              <Icon
                size={20}
                color={isSelected ? '#FFFFFF' : colors.text.tertiary}
              />
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? '#FFFFFF' : colors.text.primary },
                ]}
              >
                {type.label}
              </Text>
              {isSelected && <Check size={16} color="#FFFFFF" />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
