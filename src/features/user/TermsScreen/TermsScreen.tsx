import { memo, useCallback } from 'react';
import { Text, Linking, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { LegalDocument } from '@/features/legal/LegalDocument';
import { TERMS, TERMS_VERSION } from '@/features/legal/terms';
import styles from './styles';

export const TermsScreen = memo(function TermsScreen() {
  const colors = useThemedColors();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/register');
  }, []);

  const handleContact = useCallback(() => {
    Linking.openURL('mailto:rutica.app@gmail.com');
  }, []);

  return (
    <LegalDocument
      title="Términos y Condiciones"
      subtitle={`Versión ${TERMS_VERSION}`}
      sections={TERMS}
      onBack={handleBack}
      footer={
        <Pressable
          style={[styles.contactButton, { borderColor: colors.primary[500] }]}
          onPress={handleContact}
          accessibilityRole="link"
          accessibilityLabel="Enviar correo a rutica.app@gmail.com"
        >
          <Mail color={colors.primary[500]} size={16} />
          <Text style={[styles.contactButtonText, { color: colors.primary[500] }]}>
            Enviar correo
          </Text>
        </Pressable>
      }
    />
  );
});

export default TermsScreen;
