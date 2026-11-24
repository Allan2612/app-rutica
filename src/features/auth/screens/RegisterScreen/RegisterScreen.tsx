import { memo, useState, useCallback } from 'react';
import { firstError, registerSchema } from '@/utils/validation';
import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ArrowLeft, Camera, Check, X } from 'lucide-react-native';
import { PRIVACY_POLICY_VERSION } from '@/features/legal/privacyPolicy';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const colors = useThemedColors();

  const handlePickProfilePhoto = useCallback(async () => {
    try {
      setPickingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    } finally {
      setPickingImage(false);
    }
  }, []);

  const handleRemoveProfilePhoto = useCallback(() => {
    setProfilePhoto(null);
  }, []);

  const handleRegister = useCallback(async () => {
    const invalid = firstError(registerSchema, {
      firstName,
      lastName1,
      email,
      phone,
      password,
      confirmPassword,
    });
    if (invalid) {
      Toast.show({
        type: 'error',
        text1: 'Revisa el formulario',
        text2: invalid,
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    if (!acceptedTerms) {
      Toast.show({
        type: 'error',
        text1: 'Falta tu aceptación',
        text2: 'Debes aceptar los Términos y la Política de Privacidad',
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
        profilePhotoUri: profilePhoto || undefined,
        termsVersion: PRIVACY_POLICY_VERSION,
      });

      Toast.show({
        type: 'success',
        text1: '¡Registro exitoso!',
        text2: 'Revisa tu correo para confirmar la cuenta y luego inicia sesión',
        position: 'top',
        visibilityTime: 4000,
      });

      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } catch (error: any) {
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
  }, [
    email,
    password,
    confirmPassword,
    firstName,
    lastName1,
    lastName2,
    phone,
    role,
    profilePhoto,
    acceptedTerms,
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.secondary }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.background.primary }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            accessibilityRole="button"
            accessibilityLabel="Volver"
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
            Lee nuestros{' '}
            <Text
              style={[sharedStyles.footerLink, { color: colors.primary[500] }]}
              onPress={() => router.push('/(auth)/terms')}
            >
              Términos y Condiciones
            </Text>
            {' y la '}
            <Text
              style={[sharedStyles.footerLink, { color: colors.primary[500] }]}
              onPress={() => router.push('/(auth)/privacy' as any)}
            >
              Política de Privacidad
            </Text>
          </Text>
        }
      >
        {/* Foto de perfil */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>
            Foto de perfil (opcional)
          </Text>
          <View style={{ alignItems: 'center', marginTop: 8 }}>
            {profilePhoto ? (
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: profilePhoto }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: colors.primary[500],
                  }}
                />
                <Pressable
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: colors.error[500],
                    borderRadius: 12,
                    width: 24,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={handleRemoveProfilePhoto}
                >
                  <X color="#fff" size={14} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => ({
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: colors.background.tertiary,
                  borderWidth: 2,
                  borderColor: colors.border.medium,
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: pressed || pickingImage ? 0.5 : 1,
                })}
                onPress={handlePickProfilePhoto}
                disabled={pickingImage || loading}
              >
                {pickingImage ? (
                  <ActivityIndicator size="small" color={colors.primary[500]} />
                ) : (
                  <>
                    <Camera size={28} color={colors.text.tertiary} />
                    <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 4 }}>
                      Añadir foto
                    </Text>
                  </>
                )}
              </Pressable>
            )}
          </View>
        </View>

        {/* Tipo de cuenta */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text.primary }]}>Tipo de cuenta</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                {
                  borderColor: role === 'buyer' ? colors.primary[500] : colors.border.medium,
                  backgroundColor:
                    role === 'buyer'
                      ? colors.isDark
                        ? colors.primary[900]
                        : colors.primary[50]
                      : colors.background.tertiary,
                },
              ]}
              onPress={() => setRole('buyer')}
            >
              <Text
                style={[
                  styles.roleTitle,
                  {
                    color:
                      role === 'buyer'
                        ? colors.isDark
                          ? colors.primary[400]
                          : colors.primary[700]
                        : colors.text.primary,
                  },
                ]}
              >
                Usuario
              </Text>
              <Text style={[styles.roleSubtitle, { color: colors.text.secondary }]}>
                Descubre y explora
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                {
                  borderColor: role === 'seller' ? colors.primary[500] : colors.border.medium,
                  backgroundColor:
                    role === 'seller'
                      ? colors.isDark
                        ? colors.primary[900]
                        : colors.primary[50]
                      : colors.background.tertiary,
                },
              ]}
              onPress={() => setRole('seller')}
            >
              <Text
                style={[
                  styles.roleTitle,
                  {
                    color:
                      role === 'seller'
                        ? colors.isDark
                          ? colors.primary[400]
                          : colors.primary[700]
                        : colors.text.primary,
                  },
                ]}
              >
                Negocio
              </Text>
              <Text style={[styles.roleSubtitle, { color: colors.text.secondary }]}>
                Promociona tu negocio
              </Text>
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

        {/* Consentimiento expreso (Ley 8968) */}
        <Pressable
          onPress={() => setAcceptedTerms((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedTerms }}
          accessibilityLabel="Acepto los Términos y Condiciones y la Política de Privacidad"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: acceptedTerms ? colors.primary[500] : colors.border.dark,
              backgroundColor: acceptedTerms ? colors.primary[500] : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {acceptedTerms && <Check size={14} color="#fff" strokeWidth={3} />}
          </View>
          <Text style={{ flex: 1, color: colors.text.secondary, fontSize: 13 }}>
            Acepto los Términos y Condiciones y la Política de Privacidad
          </Text>
        </Pressable>

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
              <Text style={[sharedStyles.link, { color: colors.primary[500] }]}>
                Inicia sesión aquí
              </Text>
            </Pressable>
          </Text>
        </View>
      </AuthCard>
    </View>
  );
});
