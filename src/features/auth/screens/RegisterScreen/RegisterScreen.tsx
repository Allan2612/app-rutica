import { memo, useState, useCallback } from 'react';
import { Alert, Text, View, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { AuthCard, AuthInput, AuthButton } from '../../../../components/auth';
import { signUp } from '../../services/auth.service';
import type { UserRole } from '../../../../types/enums';
import { styles } from './styles';
import { sharedStyles } from '../shared-styles';

export const RegisterScreen = memo(function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('buyer');
  const [loading, setLoading] = useState(false);

  const handleRegister = useCallback(async () => {
    console.log('[REGISTER] Intentando registro...');

    if (!email || !password || !name || !confirmPassword) {
      Alert.alert(
        'Campos incompletos',
        'Por favor completa todos los campos obligatorios.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Contraseñas no coinciden',
        'La contraseña y la confirmación deben ser iguales.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Contraseña inválida',
        'La contraseña debe tener al menos 6 caracteres.'
      );
      return;
    }

    setLoading(true);

    try {
      await signUp({
        email,
        password,
        fullName: name,
        phone,
        role,
      });
      console.log('[REGISTER] Registro exitoso');

      Alert.alert('Registro exitoso', 'Tu cuenta fue creada correctamente.', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    } catch (error: any) {
      console.error('[REGISTER] Error:', error);
      Alert.alert(
        'Error al registrarse',
        error?.message ?? 'Ocurrió un error inesperado'
      );
    } finally {
      setLoading(false);
    }
  }, [email, password, confirmPassword, name, phone, role]);

  return (
    <AuthCard
      title="Crear Cuenta"
      footer={
        <Text style={sharedStyles.footerTextSmall}>
          Al registrarte, aceptas nuestros{' '}
          <Text style={sharedStyles.footerLink}>Términos y Condiciones</Text>
          {' y '}
          <Text style={sharedStyles.footerLink}>Política de Privacidad</Text>
        </Text>
      }
    >
      {/* Tipo de cuenta */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tipo de cuenta</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'buyer' && styles.roleButtonActive,
            ]}
            onPress={() => setRole('buyer')}
          >
            <Text style={styles.roleIcon}>👤</Text>
            <Text
              style={[
                styles.roleTitle,
                role === 'buyer' && styles.roleTextActive,
              ]}
            >
              Comprador
            </Text>
            <Text style={styles.roleSubtitle}>Descubre y explora</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'seller' && styles.roleButtonActive,
            ]}
            onPress={() => setRole('seller')}
          >
            <Text style={styles.roleIcon}>🏪</Text>
            <Text
              style={[
                styles.roleTitle,
                role === 'seller' && styles.roleTextActive,
              ]}
            >
              Vendedor
            </Text>
            <Text style={styles.roleSubtitle}>Promociona tu negocio</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AuthInput
        label="Nombre completo"
        placeholder="Tu nombre"
        value={name}
        onChangeText={setName}
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
        <Text style={sharedStyles.linkText}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/(auth)/login">
            <Text style={sharedStyles.link}>Inicia sesión aquí</Text>
          </Link>
        </Text>
      </View>
    </AuthCard>
  );
});
