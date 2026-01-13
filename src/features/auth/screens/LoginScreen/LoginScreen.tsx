import { memo, useState, useCallback } from 'react';
import { Alert, Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { AuthCard, AuthInput, AuthButton } from '@/components/auth';
import { signIn } from '@/features/auth/services/auth.service';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';
import { sharedStyles } from '@/features/auth/screens/shared-styles';

export const LoginScreen = memo(function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colors = useThemedColors();

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Ingresa correo y contraseña.');
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, password });
      
      // El listener se encargará de cargar los datos
      setTimeout(() => {
        router.replace('/(app)/(tabs)/home');
      }, 100);
    } catch (error: any) {
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
        <Text style={[sharedStyles.footerText, { color: colors.text.tertiary }]}>
          Al iniciar sesión, aceptas nuestros{' '}
          <Text style={[sharedStyles.footerLink, { color: colors.primary[500] }]}>Términos y Condiciones</Text>
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
            <Text style={[sharedStyles.linkSmall, { color: colors.primary[500] }]}>¿Olvidaste la contraseña?</Text>
          </Link>
        }
      />

      <AuthButton
        title={loading ? 'Ingresando...' : 'Iniciar Sesión'}
        loading={loading}
        onPress={handleLogin}
        style={sharedStyles.buttonSpacing}
      />

      <View style={[sharedStyles.separator, { backgroundColor: colors.border.medium }]} />

      <View style={styles.accountOptions}>
        <Text style={[sharedStyles.linkText, { color: colors.text.secondary }]}>
          ¿No tienes cuenta?{' '}
          <Link href="/(auth)/register">
            <Text style={[sharedStyles.link, { color: colors.primary[500] }]}>Regístrate aquí</Text>
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
