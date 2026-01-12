import { memo, useState, useCallback } from 'react';
import { Alert, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { AuthCard, AuthInput, AuthButton } from '@/components/auth';
import { signIn } from '@/features/auth/services/auth.service';
import { styles } from './styles';
import { sharedStyles } from '@/features/auth/screens/shared-styles';

export const LoginScreen = memo(function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Ingresa correo y contraseña.');
      return;
    }

    setLoading(true);
    console.log('[LOGIN] Intentando login...');

    try {
      await signIn({ email, password });
      console.log('[LOGIN] Login exitoso');
      router.replace('/(app)/(tabs)/home');
    } catch (error: any) {
      console.error('[LOGIN] Error:', error);
      Alert.alert(
        'Error al iniciar sesión',
        error?.message ?? 'Credenciales incorrectas'
      );
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const handleContinueWithoutAccount = useCallback(() => {
    console.log('[LOGIN] Continuar sin cuenta');
    router.replace('/(app)/(tabs)/home');
  }, []);

  return (
    <AuthCard
      title="Iniciar Sesión"
      footer={
        <Text style={sharedStyles.footerText}>
          Al iniciar sesión, aceptas nuestros{' '}
          <Text style={sharedStyles.footerLink}>Términos y Condiciones</Text>
        </Text>
      }
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

      <AuthInput
        label="Contraseña"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        headerRight={
          <Link href="/(auth)/recover">
            <Text style={sharedStyles.linkSmall}>¿Olvidaste la contraseña?</Text>
          </Link>
        }
      />

      <AuthButton
        title={loading ? 'Ingresando...' : 'Iniciar Sesión'}
        loading={loading}
        onPress={handleLogin}
        style={sharedStyles.buttonSpacing}
      />

      <View style={sharedStyles.separator} />

      <View style={styles.accountOptions}>
        <Text style={sharedStyles.linkText}>
          ¿No tienes cuenta?{' '}
          <Link href="/(auth)/register">
            <Text style={sharedStyles.link}>Regístrate aquí</Text>
          </Link>
        </Text>

        <AuthButton
          title="Continuar sin cuenta"
          variant="secondary"
          style={styles.continueButton}
          onPress={handleContinueWithoutAccount}
        />
      </View>
    </AuthCard>
  );
});
