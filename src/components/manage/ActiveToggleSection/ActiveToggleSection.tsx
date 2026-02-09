import { memo } from 'react';
import { View, Text, Switch } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { formSectionStyles } from '@/styles/form-section-styles';
import { styles } from './styles';

interface ActiveToggleSectionProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
  activeText?: string;
  inactiveText?: string;
  helperText?: string;
}

export const ActiveToggleSection = memo(function ActiveToggleSection({
  isActive,
  onToggle,
  label = 'Estado de Visibilidad',
  activeText = 'Visible para usuarios',
  inactiveText = 'Oculto para usuarios',
  helperText,
}: ActiveToggleSectionProps) {
  const colors = useThemedColors();

  return (
    <View style={formSectionStyles.section}>
      <Text style={[formSectionStyles.label, { color: colors.text.primary }]}>{label}</Text>

      <View
        style={[
          styles.toggleContainer,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.medium,
          },
        ]}
      >
        <View style={styles.toggleContent}>
          <View style={styles.iconContainer}>
            {isActive ? (
              <Eye size={24} color={colors.success} strokeWidth={2} />
            ) : (
              <EyeOff size={24} color={colors.text.tertiary} strokeWidth={2} />
            )}
          </View>

          <View style={styles.toggleInfo}>
            <Text
              style={[
                styles.toggleStatus,
                {
                  color: isActive ? colors.success : colors.text.secondary,
                },
              ]}
            >
              {isActive ? activeText : inactiveText}
            </Text>
            {helperText && (
              <Text style={[styles.helperText, { color: colors.text.tertiary }]}>{helperText}</Text>
            )}
          </View>
        </View>

        <Switch
          value={isActive}
          onValueChange={onToggle}
          trackColor={{ false: colors.background.tertiary, true: colors.success }}
          thumbColor={isActive ? '#fff' : colors.text.tertiary}
        />
      </View>
    </View>
  );
});
