import { memo } from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface StepIndicatorProps {
  currentStep: 'plans' | 'business' | 'payment';
}

export const StepIndicator = memo(function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  const colors = useThemedColors();

  // Determinar qué pasos están completados
  const isStep1Completed = currentStep === 'business' || currentStep === 'payment';
  const isStep2Completed = currentStep === 'payment';

  // Siempre mostrar 3 pasos: Plan → Negocio → Pago
  return (
    <View style={styles.stepIndicator}>
      {/* Paso 1 - Plan */}
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
                { color: currentStep === 'plans' ? '#ffffff' : colors.text.secondary },
              ]}
            >
              1
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.stepLabel,
            { color: currentStep === 'plans' || isStep1Completed ? colors.primary[500] : colors.text.tertiary },
          ]}
        >
          Plan
        </Text>
      </View>

      {/* Línea conectora 1-2 */}
      <View
        style={[
          styles.stepLine,
          { backgroundColor: isStep1Completed ? colors.primary[500] : colors.border.medium },
        ]}
      />

      {/* Paso 2 - Negocio */}
      <View style={styles.stepWrapper}>
        <View
          style={[
            styles.stepCircle,
            (currentStep === 'business' || isStep2Completed) && styles.stepCircleActive,
            {
              backgroundColor:
                currentStep === 'business' || isStep2Completed
                  ? colors.primary[500]
                  : colors.isDark
                    ? colors.background.tertiary
                    : colors.background.primary,
              borderColor:
                currentStep === 'business' || isStep2Completed ? colors.primary[500] : colors.border.medium,
            },
          ]}
        >
          {isStep2Completed ? (
            <Check size={18} color="#ffffff" strokeWidth={3} />
          ) : (
            <Text
              style={[
                styles.stepNumber,
                { color: currentStep === 'business' ? '#ffffff' : colors.text.secondary },
              ]}
            >
              2
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.stepLabel,
            { color: currentStep === 'business' || isStep2Completed ? colors.primary[500] : colors.text.tertiary },
          ]}
        >
          Negocio
        </Text>
      </View>

      {/* Línea conectora 2-3 */}
      <View
        style={[
          styles.stepLine,
          { backgroundColor: isStep2Completed ? colors.primary[500] : colors.border.medium },
        ]}
      />

      {/* Paso 3 - Pago */}
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
              borderColor: currentStep === 'payment' ? colors.primary[500] : colors.border.medium,
            },
          ]}
        >
          <Text
            style={[
              styles.stepNumber,
              { color: currentStep === 'payment' ? '#ffffff' : colors.text.secondary },
            ]}
          >
            3
          </Text>
        </View>
        <Text
          style={[
            styles.stepLabel,
            { color: currentStep === 'payment' ? colors.primary[500] : colors.text.tertiary },
          ]}
        >
          Pago
        </Text>
      </View>
    </View>
  );
});
