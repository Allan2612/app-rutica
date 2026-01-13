import { memo, useState, useCallback } from 'react';
import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import Toast from 'react-native-toast-message';
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
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Ingresa correo y contraseña',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, password });
      
      Toast.show({
        type: 'success',
        text1: '¡Bienvenido!',
        text2: 'Sesión iniciada correctamente',
        position: 'top',
        visibilityTime: 2000,
      });

      // El listener se encargará de cargar los datos
      setTimeout(() => {
        router.replace('/(app)/(tabs)/home');
      }, 500);
    } catch (error: any) {
      console.error('[LOGIN] Error:', error);
      const errorMessage = error?.message || 'Credenciales incorrectas';
      
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: errorMessage.includes('Invalid') 
          ? 'Correo o contraseña incorrectos' 
          : errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
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
