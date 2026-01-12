import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store';
import { colors } from '@/styles/theme';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Si ya está autenticado, redirigir a home
    if (!isLoading && isAuthenticated) {
      router.replace('/(app)/(tabs)/home');
    }
  }, [isAuthenticated, isLoading]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  const handleExplore = () => {
    router.replace('/(app)/(tabs)/home');
  };

  const handleLogin = () => {
    router.replace('/(auth)/login');
  };

  const handleRegister = () => {
    router.replace('/(auth)/register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image 
          source={require('..//assets/logo.png')} 
          style={styles.logo}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
        />
        <Text style={styles.title}>Bienvenido a Rutica</Text>
        <Text style={styles.subtitle}>
          Descubre comercios, atracciones y promociones cerca de ti
        </Text>

        {/* Botones */}
        <View style={styles.buttons}>
          <Pressable style={styles.buttonPrimary} onPress={handleExplore}>
            <Text style={styles.buttonPrimaryText}>Explorar sin cuenta</Text>
          </Pressable>

          <Pressable style={styles.buttonSecondary} onPress={handleLogin}>
            <Text style={styles.buttonSecondaryText}>Iniciar sesión</Text>
          </Pressable>

          <Pressable style={styles.buttonText} onPress={handleRegister}>
            <Text style={styles.buttonTextLabel}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.buttonTextLink}>Regístrate aquí</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  buttonPrimary: {
    backgroundColor: colors.primary[500],
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary[500],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: colors.primary[500],
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonTextLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  buttonTextLink: {
    color: colors.primary[500],
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
