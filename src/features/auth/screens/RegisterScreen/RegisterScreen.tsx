import { memo, useState, useCallback } from 'react';
import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthCard, AuthInput, AuthButton } from '@/components/auth';
import { signUp } from '@/features/auth/services/auth.service';
import { useThemedColors } from '@/hooks';
import type { UserRole } from '@/types/enums';
import { styles } from './styles';
import { sharedStyles } from '@/features/auth/screens/shared-styles';

export const RegisterScreen = memo(function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [loading, setLoading] = useState(false);
  const colors = useThemedColors();

  const handleRegister = useCallback(async () => {
    if (!email || !password || !firstName || !lastName1 || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor completa todos los campos obligatorios',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Contraseñas no coinciden',
        text2: 'La contraseña y la confirmación deben ser iguales',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña muy corta',
        text2: 'Debe tener al menos 6 caracteres',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email,
        password,
        firstName,
        lastName1,
        lastName2: lastName2 || undefined,
        phone,
        role,
      });

      Toast.show({
        type: 'success',
        text1: '¡Registro exitoso!',
        text2: 'Tu cuenta fue creada. Ahora puedes iniciar sesión',
        position: 'top',
        visibilityTime: 4000,
      });

      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } catch (error: any) {
      console.error('[REGISTER] Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al registrarse',
        text2: error?.message || 'Ocurrió un error inesperado',
        position: 'top',
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, firstName, lastName1, lastName2, phone, role]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.secondary }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background.primary }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <Pressable
            onPress={() => router.replace('/(app)/(tabs)/manage')}
            style={{ width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}
          >
            <ArrowLeft size={22} color={colors.text.primary} />
          </Pressable>
        </View>
      </SafeAreaView>

      <AuthCard
        title="Crear Cuenta"
        footer={
          <Text style={[sharedStyles.footerTextSmall, { color: colors.text.tertiary }]}>
            Al registrarte, aceptas nuestros{' '}
            <Text style={[sharedStyles.footerLink, { color: colors.primary[500] }]}>Términos y Condiciones</Text>
            {' y '}
            <Text style={[sharedStyles.footerLink, { color: colors.primary[500] }]}>Política de Privacidad</Text>
          </Text>
        }
      >
        {/* Tipo de cuenta */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Tipo de cuenta</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                {
                  borderColor: role === 'buyer' ? colors.primary[500] : colors.border.medium,
                  backgroundColor: role === 'buyer' ? (colors.isDark ? colors.primary[900] : colors.primary[50]) : colors.background.tertiary,
                },
              ]}
              onPress={() => setRole('buyer')}
            >
              <Text
                style={[
                  styles.roleTitle,
                  {
                    color: role === 'buyer' ? (colors.isDark ? colors.primary[400] : colors.primary[700]) : colors.text.primary,
                  },
                ]}
              >
                Comprador
              </Text>
              <Text style={[styles.roleSubtitle, { color: colors.text.secondary }]}>Descubre y explora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                {
                  borderColor: role === 'seller' ? colors.primary[500] : colors.border.medium,
                  backgroundColor: role === 'seller' ? (colors.isDark ? colors.primary[900] : colors.primary[50]) : colors.background.tertiary,
                },
              ]}
              onPress={() => setRole('seller')}
            >
              <Text
                style={[
                  styles.roleTitle,
                  {
                    color: role === 'seller' ? (colors.isDark ? colors.primary[400] : colors.primary[700]) : colors.text.primary,
                  },
                ]}
              >
                Vendedor
              </Text>
              <Text style={[styles.roleSubtitle, { color: colors.text.secondary }]}>Promociona tu negocio</Text>
            </TouchableOpacity>
          </View>
        </View>

        <AuthInput
          label="Nombre"
          placeholder="Tu nombre"
          value={firstName}
          onChangeText={setFirstName}
          editable={!loading}
        />

        <AuthInput
          label="Primer apellido"
          placeholder="Tu primer apellido"
          value={lastName1}
          onChangeText={setLastName1}
          editable={!loading}
        />

        <AuthInput
          label="Segundo apellido (opcional)"
          placeholder="Tu segundo apellido"
          value={lastName2}
          onChangeText={setLastName2}
          editable={!loading}
        />

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
          label="Teléfono"
          placeholder="+506 0000-0000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          editable={!loading}
        />

        <AuthInput
          label="Contraseña"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <AuthInput
          label="Confirmar contraseña"
          placeholder="••••••••"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        <AuthButton
          title={loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          loading={loading}
          onPress={handleRegister}
          style={sharedStyles.buttonSpacing}
        />

        <View style={sharedStyles.section}>
          <Text style={[sharedStyles.linkText, { color: colors.text.secondary }]}>
            ¿Ya tienes cuenta?{' '}
            <Pressable onPress={() => router.replace('/(auth)/login')}>
              <Text style={[sharedStyles.link, { color: colors.primary[500] }]}>Inicia sesión aquí</Text>
            </Pressable>
          </Text>
        </View>
      </AuthCard>
    </View>
  );
});
