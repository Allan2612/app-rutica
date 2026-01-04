import { memo, ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AuthLogo } from '../AuthLogo';
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
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <AuthLogo />
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        {children}
      </View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </ScrollView>
  );
});
