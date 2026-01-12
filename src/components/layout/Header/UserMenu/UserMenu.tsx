import { memo, useCallback } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { router } from 'expo-router';
import { User, LogOut, Settings, UserCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store';
import { styles } from './styles';

interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
  user: any | null;
  isAuthenticated: boolean;
}

export const UserMenu = memo(function UserMenu({
  visible,
  onClose,
  user,
  isAuthenticated,
}: UserMenuProps) {
  const signOut = useAuthStore((state) => state.signOut);

  const handleLogin = useCallback(() => {
    onClose();
    router.push('/(auth)/login');
  }, [onClose]);

  const handleRegister = useCallback(() => {
    onClose();
    router.push('/(auth)/register');
  }, [onClose]);

  const handleProfile = useCallback(() => {
    onClose();
    router.push('/(app)/profile');
  }, [onClose]);

  const handleSettings = useCallback(() => {
    onClose();
    router.push('/(app)/settings');
  }, [onClose]);

  const handleSupport = useCallback(() => {
    onClose();
    router.push('/(app)/support');
  }, [onClose]);

  const handleLogout = useCallback(async () => {
    onClose();
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('[LOGOUT] Error:', error);
    }
  }, [onClose, signOut]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          {isAuthenticated ? (
            <>
              {/* Información del usuario */}
              <View style={styles.menuHeader}>
                <View style={styles.menuUserIcon}>
                  <User color="#10b981" size={24} />
                </View>
                <View style={styles.menuUserInfo}>
                  <Text style={styles.menuUserName} numberOfLines={1}>
                    {user?.email?.split('@')[0] || 'Usuario'}
                  </Text>
                  <Text style={styles.menuUserEmail} numberOfLines={1}>
                    {user?.email || ''}
                  </Text>
                </View>
              </View>

              <View style={styles.menuDivider} />

              {/* Opciones para usuario logueado */}
              <Pressable style={styles.menuItem} onPress={handleProfile}>
                <UserCircle color="#333" size={20} />
                <Text style={styles.menuItemText}>Mi perfil</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleSettings}>
                <Settings color="#333" size={20} />
                <Text style={styles.menuItemText}>Configuración</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleSupport}>
                <UserCircle color="#10b981" size={20} />
                <Text style={styles.menuItemText}>Soporte</Text>
              </Pressable>

              <View style={styles.menuDivider} />

              <Pressable style={styles.menuItemDanger} onPress={handleLogout}>
                <LogOut color="#ef4444" size={20} />
                <Text style={styles.menuItemTextDanger}>Cerrar sesión</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Opciones para usuario no logueado */}
              <Pressable style={styles.menuItem} onPress={handleLogin}>
                <User color="#10b981" size={20} />
                <Text style={styles.menuItemTextPrimary}>Iniciar sesión</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleRegister}>
                <UserCircle color="#333" size={20} />
                <Text style={styles.menuItemText}>Registrarse</Text>
              </Pressable>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
});
