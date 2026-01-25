import { memo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import { Calendar, AlertCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemedColors, useCategories } from '@/hooks';
import { CategorySelector } from '@/components/ui';
import { formSectionStyles } from '@/styles/form-section-styles';
import type { PromotionWizardFormData, PromotionWizardErrors } from '@/types/entities';
import { styles } from './styles';

interface WizardStepDatesProps {
  formData: PromotionWizardFormData;
  errors: PromotionWizardErrors;
  onFieldChange: <K extends keyof PromotionWizardFormData>(
    field: K,
    value: PromotionWizardFormData[K]
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

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleStartDateChange = (_: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onFieldChange('startDate', selectedDate);
      // If end date is before new start date, update it
      if (formData.endDate <= selectedDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        onFieldChange('endDate', newEndDate);
      }
    }
  };

  const handleEndDateChange = (_: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      onFieldChange('endDate', selectedDate);
    }
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
          <Pressable
            style={[
              styles.dateButton,
              {
                backgroundColor: colors.background.secondary,
                borderColor: errors.startDate ? colors.error : colors.border.medium,
              },
            ]}
            onPress={() => setShowStartPicker(true)}
          >
            <Calendar size={18} color={colors.text.tertiary} />
            <Text style={[styles.dateText, { color: colors.text.primary }]}>
              {formatDate(formData.startDate)}
            </Text>
          </Pressable>
          {errors.startDate && (
            <Text style={[styles.fieldError, { color: colors.error }]}>
              {errors.startDate}
            </Text>
          )}
        </View>

        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Fecha de fin <Text style={formSectionStyles.required}>*</Text>
          </Text>
          <Pressable
            style={[
              styles.dateButton,
              {
                backgroundColor: colors.background.secondary,
                borderColor: errors.endDate ? colors.error : colors.border.medium,
              },
            ]}
            onPress={() => setShowEndPicker(true)}
          >
            <Calendar size={18} color={colors.text.tertiary} />
            <Text style={[styles.dateText, { color: colors.text.primary }]}>
              {formatDate(formData.endDate)}
            </Text>
          </Pressable>
          {errors.endDate && (
            <Text style={[styles.fieldError, { color: colors.error }]}>{errors.endDate}</Text>
          )}

          {/* Duration info */}
          {formData.startDate && formData.endDate && (
            <View
              style={[styles.durationBadge, { backgroundColor: colors.background.tertiary }]}
            >
              <Text style={[styles.durationText, { color: colors.text.secondary }]}>
                Duración:{' '}
                {Math.ceil(
                  (formData.endDate.getTime() - formData.startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                días
              </Text>
            </View>
          )}
        </View>

        {/* Categories */}
        <View style={formSectionStyles.section}>
          <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>
            Categorías <Text style={formSectionStyles.required}>*</Text>
          </Text>
          <CategorySelector
            categories={categories}
            selectedIds={formData.selectedCategoryIds}
            onSelectionChange={handleCategoryChange}
            isLoading={categoriesLoading}
          />
          {errors.selectedCategoryIds && (
            <View style={styles.errorContainer}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.selectedCategoryIds}
              </Text>
            </View>
          )}
        </View>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={formData.startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={formData.endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
            minimumDate={new Date(formData.startDate.getTime() + 24 * 60 * 60 * 1000)}
          />
        )}
      </View>
    </View>
  );
});




