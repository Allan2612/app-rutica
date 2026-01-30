import { memo, useState, useCallback } from 'react';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthCard, AuthInput, AuthButton } from '@/components/auth';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store';
import { sharedStyles } from '@/features/auth/screens/shared-styles';

export const ResetPasswordScreen = memo(function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = useCallback(async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor completa todos los campos',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Contraseñas no coinciden',
        text2: 'Las contraseñas deben ser iguales',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña muy corta',
        text2: 'Debe tener al menos 6 caracteres',
        position: 'top',
        visibilityTime: 3000,
      });
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
        text1: 'Contraseña actualizada',
        text2: 'Tu contraseña ha sido restablecida correctamente',
        position: 'top',
        visibilityTime: 3000,
      });

      // Limpiar modo recovery y hacer signOut limpio
      useAuthStore.getState().setRecoveryMode(false);
      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar',
        text2: error?.message || 'No se pudo actualizar la contraseña',
        position: 'top',
        visibilityTime: 4000,
      });
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
