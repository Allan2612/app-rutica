import { memo } from 'react';
import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { WIZARD_STEPS } from '@/types/entities';
import { styles } from './styles';

interface WizardProgressBarProps {
  currentStepIndex: number;
  progress: number;
}

export const WizardProgressBar = memo(function WizardProgressBar({
  currentStepIndex,
}: WizardProgressBarProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {WIZARD_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isLast = index === WIZARD_STEPS.length - 1;

          return (
            <View key={step.id} style={styles.stepWrapper}>
              {/* Step Circle */}
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor: isCompleted
                      ? colors.primary[500]
                      : isActive
                      ? colors.primary[500]
                      : colors.background.tertiary,
                    borderWidth: isActive ? 0 : 0,
                  },
                ]}
              >
                {isCompleted ? (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color: isActive ? '#FFFFFF' : colors.text.tertiary,
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {/* Connecting Line */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor: isCompleted
                        ? colors.primary[500]
                        : colors.border.light,
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
});




