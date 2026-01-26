import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isCurrentStepValid?: boolean;
  nextLabel?: string;
  submitLabel?: string;
}

export const WizardNavigation = memo(function WizardNavigation({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
  isCurrentStepValid = true,
  nextLabel = 'Siguiente',
  submitLabel = 'Crear Promoción',
}: WizardNavigationProps) {
  const colors = useThemedColors();

  const handleNextOrSubmit = () => {
    if (isLastStep) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <View style={[styles.container, { borderTopColor: colors.border.light }]}>
      {/* Previous Button */}
      <Pressable
        style={[
          styles.button,
          styles.secondaryButton,
          {
            backgroundColor: colors.background.primary,
            borderWidth: 1,
            borderColor: colors.border.medium,
            opacity: isFirstStep ? 0.5 : 1,
          },
        ]}
        onPress={onPrevious}
        disabled={isFirstStep || isSubmitting}
      >
        <ChevronLeft size={20} color={colors.text.primary} />
        <Text style={[styles.buttonText, { color: colors.text.primary }]}>Anterior</Text>
      </Pressable>

      {/* Next/Submit Button */}
      <Pressable
        style={[
          styles.button,
          styles.primaryButton,
          {
            backgroundColor: isCurrentStepValid
              ? colors.primary[500]
              : colors.primary[300],
          },
        ]}
        onPress={handleNextOrSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <>
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {isLastStep ? submitLabel : nextLabel}
            </Text>
            {isLastStep ? (
              <Check size={20} color="#FFFFFF" />
            ) : (
              <ChevronRight size={20} color="#FFFFFF" />
            )}
          </>
        )}
      </Pressable>
    </View>
  );
});




