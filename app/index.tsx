import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Pressable } from 'react-native';
import { supabase } from '../src/lib/supabase/client';
import { colors } from '../src/styles/theme';

export default function Index() {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Solo verificar sesión, NO redirigir automáticamente
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error obteniendo sesión:', sessionError);
        return;
      }

      if (session) {
        // Validar que el usuario realmente exista
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.log('Sesión inválida, limpiando...');
          await supabase.auth.signOut();
          return;
        }

        // Sesión válida, ir directamente a businesses
        router.replace('/(app)/(tabs)/businesses');
      }
      // Si no hay sesión, mostrar pantalla de bienvenida
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const handleExplore = () => {
    router.replace('/(app)/(tabs)/businesses');
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
        <Text style={styles.logo}>🗺️</Text>
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
    fontSize: 64,
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
