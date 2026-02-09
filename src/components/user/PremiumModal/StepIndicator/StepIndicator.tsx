import { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface StepIndicatorProps {
  currentStep: 'plans' | 'business' | 'entity' | 'payment';
}

export const StepIndicator = memo(function StepIndicator({ currentStep }: StepIndicatorProps) {
  const colors = useThemedColors();

  // Determinar el label del paso 2 basado en el flujo actual
  const step2Label = useMemo(() => {
    if (currentStep === 'entity') return 'Publicación';
    return 'Negocio';
  }, [currentStep]);

  // Determinar qué pasos están completados
  // Los pasos intermedios son business o entity
  const isStep1Completed =
    currentStep === 'business' || currentStep === 'entity' || currentStep === 'payment';
  const isStep2Active = currentStep === 'business' || currentStep === 'entity';
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
                currentStep === 'plans' || isStep1Completed
                  ? colors.primary[500]
                  : colors.border.medium,
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
            {
              color:
                currentStep === 'plans' || isStep1Completed
                  ? colors.primary[500]
                  : colors.text.tertiary,
            },
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

      {/* Paso 2 - Negocio o Publicación */}
      <View style={styles.stepWrapper}>
        <View
          style={[
            styles.stepCircle,
            (isStep2Active || isStep2Completed) && styles.stepCircleActive,
            {
              backgroundColor:
                isStep2Active || isStep2Completed
                  ? colors.primary[500]
                  : colors.isDark
                    ? colors.background.tertiary
                    : colors.background.primary,
              borderColor:
                isStep2Active || isStep2Completed ? colors.primary[500] : colors.border.medium,
            },
          ]}
        >
          {isStep2Completed ? (
            <Check size={18} color="#ffffff" strokeWidth={3} />
          ) : (
            <Text
              style={[
                styles.stepNumber,
                { color: isStep2Active ? '#ffffff' : colors.text.secondary },
              ]}
            >
              2
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.stepLabel,
            {
              color: isStep2Active || isStep2Completed ? colors.primary[500] : colors.text.tertiary,
            },
          ]}
        >
          {step2Label}
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
