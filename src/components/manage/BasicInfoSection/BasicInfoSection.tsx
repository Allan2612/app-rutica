import { memo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';

interface BasicInfoSectionProps {
  name: string;
  description: string;
  onNameChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  errors?: { name?: string; description?: string; price?: string };
  nameLabel?: string;
  namePlaceholder?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
  sectionTitle?: string;
  nameRequired?: boolean;
  // Props opcionales para precio (productos)
  showPrice?: boolean;
  price?: string;
  onPriceChange?: (text: string) => void;
  priceLabel?: string;
  pricePlaceholder?: string;
  // Props opcionales para moneda (productos)
  showCurrency?: boolean;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
}

export const BasicInfoSection = memo(function BasicInfoSection({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  errors = {},
  nameLabel = 'Nombre',
  namePlaceholder = 'Ej: Café Premium',
  descriptionLabel = 'Descripción',
  descriptionPlaceholder = 'Describe tu negocio...',
  sectionTitle = 'Información Básica',
  nameRequired = true,
  // Props de precio
  showPrice = false,
  price = '',
  onPriceChange,
  priceLabel = 'Precio',
  pricePlaceholder = 'Ej: 5000',
  // Props de moneda
  showCurrency = false,
  currency = 'CRC',
  onCurrencyChange,
}: BasicInfoSectionProps) {
  const colors = useThemedColors();

  return (
    <View style={formSectionStyles.section}>
      <Text style={[formSectionStyles.sectionTitle, { color: colors.text.primary }]}>
        {sectionTitle}
      </Text>

      <View style={formSectionStyles.inputGroup}>
        <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
          {nameLabel}
          {nameRequired && <Text style={formSectionStyles.required}> *</Text>}
        </Text>
        <TextInput
          style={[
            formSectionStyles.input,
            {
              backgroundColor: colors.background.secondary,
              borderColor: errors.name ? colors.error : colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={name}
          onChangeText={onNameChange}
          placeholder={namePlaceholder}
          placeholderTextColor={colors.text.tertiary}
        />
        {errors.name && (
          <Text style={[formSectionStyles.error, { color: colors.error }]}>{errors.name}</Text>
        )}
      </View>

      <View style={formSectionStyles.inputGroup}>
        <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
          {descriptionLabel}
        </Text>
        <TextInput
          style={[
            formSectionStyles.input,
            formSectionStyles.textArea,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.medium,
              color: colors.text.primary,
            },
          ]}
          value={description}
          onChangeText={onDescriptionChange}
          placeholder={descriptionPlaceholder}
          placeholderTextColor={colors.text.tertiary}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Campo de precio (opcional - para productos) */}
      {showPrice && onPriceChange && (
        <View style={formSectionStyles.inputGroup}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            {priceLabel}
            <Text style={formSectionStyles.required}> *</Text>
          </Text>
          <TextInput
            style={[
              formSectionStyles.input,
              {
                backgroundColor: colors.background.secondary,
                borderColor: errors.price ? colors.error : colors.border.medium,
                color: colors.text.primary,
              },
            ]}
            value={price}
            onChangeText={onPriceChange}
            placeholder={pricePlaceholder}
            placeholderTextColor={colors.text.tertiary}
            keyboardType="numeric"
          />
          {errors.price && (
            <Text style={[formSectionStyles.error, { color: colors.error }]}>{errors.price}</Text>
          )}
        </View>
      )}

      {/* Selector de moneda (opcional - para productos) */}
      {showCurrency && onCurrencyChange && (
        <View style={formSectionStyles.inputGroup}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Moneda
            <Text style={formSectionStyles.required}> *</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                backgroundColor:
                  currency === 'CRC' ? colors.primary[500] + '20' : colors.background.secondary,
                borderColor: currency === 'CRC' ? colors.primary[500] : colors.border.medium,
              }}
              onPress={() => onCurrencyChange('CRC')}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: currency === 'CRC' ? colors.primary[500] : colors.text.primary,
                }}
              >
                ₡ Colones
              </Text>
            </Pressable>
            <Pressable
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 12,
                borderRadius: 8,
                borderWidth: 1,
                backgroundColor:
                  currency === 'USD' ? colors.primary[500] + '20' : colors.background.secondary,
                borderColor: currency === 'USD' ? colors.primary[500] : colors.border.medium,
              }}
              onPress={() => onCurrencyChange('USD')}
            >
              <DollarSign
                size={18}
                strokeWidth={2.5}
                color={currency === 'USD' ? colors.primary[500] : colors.text.primary}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: currency === 'USD' ? colors.primary[500] : colors.text.primary,
                }}
              >
                Dólares
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
});
