import { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { Screen } from '@/components/layout';
import { BaseHeader } from '@/components/layout/Header';
import { useAuthStore } from '@/store';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export const LogoutScreen = memo(function LogoutScreen() {
  const [loading, setLoading] = useState(false);
  const colors = useThemedColors();
  const signOutFromStore = useAuthStore((state) => state.signOut);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await signOutFromStore();
      router.replace('/');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error al cerrar sesión',
        text2: error?.message || 'No se pudo cerrar sesión',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, [signOutFromStore]);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen>
      <BaseHeader />
      <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background.primary,
              borderColor: colors.border.light,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.isDark
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(239, 68, 68, 0.1)',
              },
            ]}
          >
            <LogOut size={32} color="#ef4444" />
          </View>

          <Text style={[styles.title, { color: colors.text.primary }]}>Cerrar Sesión</Text>

          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            ¿Estás seguro de que quieres cerrar tu sesión?
          </Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.cancelButton,
                {
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.medium,
                },
              ]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text.primary }]}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={[styles.logoutButton, { opacity: loading ? 0.7 : 1 }]}
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
});

export default LogoutScreen;
