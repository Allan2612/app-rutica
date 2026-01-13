import { memo, ReactNode } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  headerRight?: ReactNode;
}

export const AuthInput = memo(function AuthInput({
  label,
  headerRight,
  ...inputProps
}: AuthInputProps) {
  const colors = useThemedColors();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>
        {headerRight}
      </View>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border.medium,
            color: colors.text.primary,
            backgroundColor: colors.background.secondary,
          }
        ]}
        placeholderTextColor={colors.text.tertiary}
        {...inputProps}
      />
    </View>
  );
});
