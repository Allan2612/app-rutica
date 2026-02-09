import { memo, ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthCard = memo(function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  const colors = useThemedColors();

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background.secondary }]}
    >
      <View style={[styles.card, { backgroundColor: colors.background.primary }]}>
        <AuthLogo />
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
        {description && (
          <Text style={[styles.description, { color: colors.text.secondary }]}>{description}</Text>
        )}
        {children}
      </View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </ScrollView>
  );
});
