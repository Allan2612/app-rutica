import { memo, ReactNode } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { colors } from '@/styles/theme';
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {headerRight}
      </View>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.text.tertiary}
        {...inputProps}
      />
    </View>
  );
});
