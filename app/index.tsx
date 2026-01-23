import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { useAuthStore } from '@/store';
import { useThemedColors } from '@/hooks';
import { MapBackground } from '@/components/maps';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const themedColors = useThemedColors();
  const [fontsLoaded] = useFonts({
    Caveat_700Bold,
  });

  useEffect(() => {
    // Si ya está autenticado, redirigir a home
    if (!isLoading && isAuthenticated) {
      router.replace('/(app)/(tabs)/home');
    }
  }, [isAuthenticated, isLoading]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: themedColors.background.primary }]}>
        <ActivityIndicator size="large" color={themedColors.primary[500]} />
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
    <View style={[styles.container, { backgroundColor: themedColors.background.primary }]}>
      {/* Fondo animado estilo mapa */}
      <MapBackground />

      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('..//assets/logo.png')}
          style={styles.logo}
          contentFit="contain"
          transition={0}
        />
        <Text style={[
          styles.title,
          { color: themedColors.primary[500] },
          fontsLoaded && { fontFamily: 'Caveat_700Bold' },
        ]}>Bienvenido a Rutica</Text>
        <Text style={[styles.subtitle, { color: themedColors.text.secondary }]}>
          Descubre comercios, atracciones y promociones cerca de ti
        </Text>

        {/* Botones */}
        <View style={styles.buttons}>
          <Pressable style={[styles.buttonPrimary, { backgroundColor: themedColors.primary[500] }]} onPress={handleExplore}>
            <Text style={styles.buttonPrimaryText}>Explorar sin cuenta</Text>
          </Pressable>

          <Pressable style={[styles.buttonSecondary, { borderColor: themedColors.primary[500] }]} onPress={handleLogin}>
            <Text style={[styles.buttonSecondaryText, { color: themedColors.primary[500] }]}>Iniciar sesión</Text>
          </Pressable>

          <Pressable style={styles.buttonText} onPress={handleRegister}>
            <Text style={[styles.buttonTextLabel, { color: themedColors.text.secondary }]}>
              ¿No tienes cuenta?{' '}
              <Text style={[styles.buttonTextLink, { color: themedColors.primary[500] }]}>Regístrate aquí</Text>
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
  },
  content: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 32,
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 16,
  },
  title: {
    fontSize: 45,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  buttonPrimary: {
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
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonTextLabel: {
    fontSize: 14,
  },
  buttonTextLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
