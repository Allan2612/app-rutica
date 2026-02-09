import { memo } from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { useThemedColors, useCategories } from '@/hooks';
import { SimpleDateTimeInput } from '@/components/ui';
import { CategorySection, ActiveToggleSection } from '@/components/manage';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { styles } from './styles';

interface WizardStepDatesProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onFieldChange: <K extends keyof PromotionWizardFormData>(
    field: K,
    value: PromotionWizardFormData[K],
  ) => void;
  onToggleCategory: (categoryId: string) => void;
}

export const WizardStepDates = memo(function WizardStepDates({
  formData,
  errors,
  onFieldChange,
  onToggleCategory,
}: WizardStepDatesProps) {
  const colors = useThemedColors();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const handleStartDateChange = (selectedDate: Date) => {
    onFieldChange('startDate', selectedDate);
    // If end date is before new start date, update it
    if (formData.endDate <= selectedDate) {
      const newEndDate = new Date(selectedDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      onFieldChange('endDate', newEndDate);
    }
  };

  const handleEndDateChange = (selectedDate: Date) => {
    onFieldChange('endDate', selectedDate);
  };

  const handleCategoryChange = (ids: string[]) => {
    onFieldChange('selectedCategoryIds', ids);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Date Selection */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Fecha de inicio <Text style={formSectionStyles.required}>*</Text>
          </Text>

          <SimpleDateTimeInput
            date={formData.startDate}
            onDateChange={handleStartDateChange}
            type="date"
            error={errors.startDate}
          />

          {errors.startDate && (
            <Text style={[styles.fieldError, { color: colors.error }]}>{errors.startDate}</Text>
          )}
        </View>

        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Fecha de fin <Text style={formSectionStyles.required}>*</Text>
          </Text>

          <SimpleDateTimeInput
            date={formData.endDate}
            onDateChange={handleEndDateChange}
            type="date"
            error={errors.endDate}
            minDate={formData.startDate.toISOString().split('T')[0]}
          />

          {errors.endDate && (
            <Text style={[styles.fieldError, { color: colors.error }]}>{errors.endDate}</Text>
          )}

          {/* Duration info */}
          {formData.startDate && formData.endDate && (
            <View style={[styles.durationBadge, { backgroundColor: colors.background.tertiary }]}>
              <Text style={[styles.durationText, { color: colors.text.secondary }]}>
                Duración:{' '}
                {Math.ceil(
                  (formData.endDate.getTime() - formData.startDate.getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{' '}
                días
              </Text>
            </View>
          )}
        </View>

        {/* Estado Activo */}
        <ActiveToggleSection
          isActive={formData.isActive ?? true}
          onToggle={(value) => onFieldChange('isActive', value)}
        />

        {/* Categories */}
        <CategorySection
          categories={categories}
          selectedIds={formData.selectedCategoryIds}
          onSelectionChange={handleCategoryChange}
          isLoading={categoriesLoading}
          error={errors.selectedCategoryIds}
        />
      </View>
    </View>
  );
});
