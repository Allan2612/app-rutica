import { memo } from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface StepIndicatorProps {
  currentStep: 'plans' | 'payment';
}

export const StepIndicator = memo(function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  const colors = useThemedColors();
  const isStep1Completed = currentStep === 'payment';

  return (
    <View style={styles.stepIndicator}>
      {/* Paso 1 */}
      <View style={styles.stepWrapper}>
        <View
          style={[
            styles.stepCircle,
            (currentStep === 'plans' || isStep1Completed) && styles.stepCircleActive,
            {
              backgroundColor:
                currentStep === 'plans' || isStep1Completed
                  ? colors.primary[500]
                  : colors.isDark
                    ? colors.background.tertiary
                    : colors.background.primary,
              borderColor:
                currentStep === 'plans' || isStep1Completed ? colors.primary[500] : colors.border.medium,
            },
          ]}
        >
          {isStep1Completed ? (
            <Check size={18} color="#ffffff" strokeWidth={3} />
          ) : (
            <Text
              style={[
                styles.stepNumber,
                {
                  color: currentStep === 'plans' ? '#ffffff' : colors.text.secondary,
                },
              ]}
            >
              1
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.stepLabel,
            {
              color: currentStep === 'plans' || isStep1Completed ? colors.primary[500] : colors.text.tertiary,
            },
          ]}
        >
          Plan
        </Text>
      </View>

      {/* Línea conectora */}
      <View
        style={[
          styles.stepLine,
          {
            backgroundColor:
              currentStep === 'payment' ? colors.primary[500] : colors.border.medium,
          },
        ]}
      />

      {/* Paso 2 */}
      <View style={styles.stepWrapper}>
        <View
          style={[
            styles.stepCircle,
            currentStep === 'payment' && styles.stepCircleActive,
            {
              backgroundColor:
                currentStep === 'payment'
                  ? colors.primary[500]
                  : colors.isDark
                    ? colors.background.tertiary
                    : colors.background.primary,
              borderColor:
                currentStep === 'payment' ? colors.primary[500] : colors.border.medium,
            },
          ]}
        >
          <Text
            style={[
              styles.stepNumber,
              {
                color: currentStep === 'payment' ? '#ffffff' : colors.text.secondary,
              },
            ]}
          >
            2
          </Text>
        </View>
        <Text
          style={[
            styles.stepLabel,
            {
              color: currentStep === 'payment' ? colors.primary[500] : colors.text.tertiary,
            },
          ]}
        >
          Pago
        </Text>
      </View>
    </View>
  );
});
