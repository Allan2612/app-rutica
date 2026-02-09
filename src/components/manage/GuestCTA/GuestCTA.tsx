import { memo, useCallback } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { AuthButton } from '@/components/auth';
import { useThemedColors } from '@/hooks';
import styles from './styles';

export interface GuestCTAProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onPressLogin?: () => void;
}

export const GuestCTA = memo(function GuestCTA({
  title = 'Inicia sesión para gestionar',
  subtitle = 'Publica negocios, crea promociones, gestiona eventos y atracciones.',
  ctaLabel = 'Iniciar sesión',
  onPressLogin,
}: GuestCTAProps) {
  const colors = useThemedColors();

  const handleLogin = useCallback(() => {
    if (onPressLogin) {
      onPressLogin();
      return;
    }
    router.push('/(auth)/login');
  }, [onPressLogin]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.illustration,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.light,
            },
          ]}
        >
          <Sparkles color={colors.primary[500]} size={34} strokeWidth={2} />
        </View>

        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{subtitle}</Text>

        <View style={[styles.benefits, { borderColor: colors.border.light }]}>
          <Text style={[styles.benefitText, { color: colors.text.secondary }]}>
            • Publica y edita negocios
          </Text>
          <Text style={[styles.benefitText, { color: colors.text.secondary }]}>
            • Crea promociones para atraer clientes
          </Text>
          <Text style={[styles.benefitText, { color: colors.text.secondary }]}>
            • Administra eventos y atracciones
          </Text>
        </View>

        <AuthButton title={ctaLabel} onPress={handleLogin} style={styles.ctaButton} />
      </View>
    </View>
  );
});
