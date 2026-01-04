import { memo, useState, useCallback } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { AuthCard, AuthInput, AuthButton } from '../../../../components/auth';
import { supabase } from '../../../../lib/supabase/client';
import Toast from 'react-native-toast-message';
import { sharedStyles } from '../shared-styles';

export const RecoverScreen = memo(function RecoverScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = useCallback(async () => {
    if (!email) {
      Alert.alert('Campo incompleto', 'Por favor ingresa tu email.');
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
        text1: '📧 Correo enviado',
        text2: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
        position: 'top',
        visibilityTime: 4000,
      });
      setEmail('');
    } catch (error: any) {
      console.error('[RECOVER] Error:', error);
      Alert.alert(
        'Error',
        error?.message ?? 'No se pudo enviar el correo de recuperación'
      );
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
          <Text style={sharedStyles.backLinkText}>
            ← Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </Link>
    </AuthCard>
  );
});
