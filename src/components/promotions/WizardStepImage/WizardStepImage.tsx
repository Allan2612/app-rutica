import { memo } from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { SingleImagePicker } from '@/components/ui';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { styles } from './styles';

interface WizardStepImageProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onFieldChange: <K extends keyof PromotionWizardFormData>(
    field: K,
    value: PromotionWizardFormData[K],
  ) => void;
}

export const WizardStepImage = memo(function WizardStepImage({
  formData,
  errors,
  onFieldChange,
}: WizardStepImageProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Imagen de portada <Text style={formSectionStyles.required}>*</Text>
          </Text>

          <SingleImagePicker
            imageUri={formData.coverUri}
            onImageChange={(uri) => onFieldChange('coverUri', uri)}
            label=""
            helperText="Recomendado: 1200x630 pixeles (16:9)"
            aspectRatio={[16, 9]}
          />

          {errors.coverUri && (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{errors.coverUri}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});
