import { memo, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { AuthCard, AuthInput, AuthButton } from '@/components/auth';
import { supabase } from '@/lib/supabase/client';
import Toast from 'react-native-toast-message';
import { sharedStyles } from '@/features/auth/screens/shared-styles';

export const ResetPasswordScreen = memo(function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = useCallback(async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      Toast.show({
        type: 'success',
        text1: '✓ Contraseña actualizada',
        text2: 'Tu contraseña ha sido restablecida correctamente',
        position: 'top',
        visibilityTime: 3000,
      });

      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error: any) {
      console.error('[RESET PASSWORD] Error:', error);
      Alert.alert(
        'Error',
        error?.message ?? 'No se pudo actualizar la contraseña'
      );
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword]);

  return (
    <AuthCard
      title="Restablecer contraseña"
      description="Ingresa tu nueva contraseña para tu cuenta."
    >
      <AuthInput
        label="Nueva contraseña"
        placeholder="Mínimo 6 caracteres"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <AuthInput
        label="Confirmar contraseña"
        placeholder="Repite tu contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <AuthButton
        title={loading ? 'Actualizando...' : 'Restablecer contraseña'}
        loading={loading}
        onPress={handleResetPassword}
        style={sharedStyles.buttonSpacing}
      />
    </AuthCard>
  );
});
