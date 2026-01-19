import { memo } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const AuthButton = memo(function AuthButton({
  title,
  variant = 'primary',
  loading,
  disabled,
  style,
  ...props
}: AuthButtonProps) {
  const colors = useThemedColors();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? { backgroundColor: colors.primary[500] } : [
          styles.secondary,
          { borderColor: colors.border.medium, backgroundColor: colors.background.secondary }
        ],
        (loading || disabled) && styles.disabled,
        style,
      ]}
      disabled={loading || disabled}
      {...props}
    >
      <Text
        style={[
          styles.text,
          { color: variant === 'primary' ? colors.text.inverse : colors.text.secondary },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
});
