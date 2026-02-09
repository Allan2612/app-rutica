import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { styles } from './styles';

interface WizardStepInfoProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onFieldChange: <K extends keyof PromotionWizardFormData>(
    field: K,
    value: PromotionWizardFormData[K],
  ) => void;
}

export const WizardStepInfo = memo(function WizardStepInfo({
  formData,
  errors,
  onFieldChange,
}: WizardStepInfoProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Título de la promoción <Text style={formSectionStyles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              formSectionStyles.input,
              {
                backgroundColor: colors.background.secondary,
                borderColor: errors.title ? colors.error : colors.border.medium,
                color: colors.text.primary,
              },
            ]}
            value={formData.title}
            onChangeText={(text) => onFieldChange('title', text)}
            placeholder="Ej: 20% de descuento en toda la tienda"
            placeholderTextColor={colors.text.tertiary}
          />
          {errors.title && (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.title}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>Descripción</Text>
          <TextInput
            style={[
              formSectionStyles.textArea,
              styles.descriptionInput,
              {
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.dark,
                color: colors.text.primary,
              },
            ]}
            value={formData.description}
            onChangeText={(text) => onFieldChange('description', text)}
            placeholder="Describe los detalles de tu promoción..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
});
