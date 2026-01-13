import { memo, useState, useCallback } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthCard, AuthInput, AuthButton } from '@/components/auth';
import { supabase } from '@/lib/supabase/client';
import { useThemedColors } from '@/hooks';
import { sharedStyles } from '@/features/auth/screens/shared-styles';

export const RecoverScreen = memo(function RecoverScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const colors = useThemedColors();

  const handleRecover = useCallback(async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Campo incompleto',
        text2: 'Por favor ingresa tu email',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:8081/reset-password',
      });

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: 'Correo enviado',
        text2: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
        position: 'top',
        visibilityTime: 4000,
      });
      setEmail('');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error al enviar correo',
        text2: error?.message || 'No se pudo enviar el correo de recuperación',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [email]);

  return (
    <AuthCard
      title="¿Olvidaste tu contraseña?"
      description="No te preocupes. Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña."
    >
      <AuthInput
        label="Email"
        placeholder="tu@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <AuthButton
        title={loading ? 'Enviando...' : 'Enviar instrucciones'}
        loading={loading}
        onPress={handleRecover}
        style={sharedStyles.buttonSpacing}
      />

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={sharedStyles.backLink}>
          <Text style={[sharedStyles.backLinkText, { color: colors.text.secondary }]}>
            ← Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </Link>
    </AuthCard>
  );
});
