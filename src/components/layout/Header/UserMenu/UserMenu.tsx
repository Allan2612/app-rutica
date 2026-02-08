import { memo, useCallback } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { User, LogOut, Settings, UserCircle, HelpCircle, Heart } from 'lucide-react-native';
import { useAuthStore } from '@/store';
import { useThemedColors, useProfilePhoto } from '@/hooks';
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
  const profileName = useAuthStore((state) => state.profileName);
  const colors = useThemedColors();
  const profilePhotoUrl = useProfilePhoto(user?.id);

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

  const handleFavorites = useCallback(() => {
    onClose();
    router.push('/(app)/favorites');
  }, [onClose]);

  const handleSettings = useCallback(() => {
    onClose();
    router.push('/(app)/settings');
  }, [onClose]);

  const handleSupport = useCallback(() => {
    onClose();
    router.push('/(app)/support');
  }, [onClose]);

  const handleLogout = useCallback(() => {
    onClose();
    router.push('/(app)/logout');
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        <View style={[styles.menuContainer, { backgroundColor: colors.background.primary }]}>
          {isAuthenticated ? (
            <>
              {/* Información del usuario */}
              <View style={styles.menuHeader}>
                {profilePhotoUrl ? (
                  <Image
                    source={{ uri: profilePhotoUrl }}
                    style={styles.menuUserIcon}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={[styles.menuUserIcon, { backgroundColor: colors.isDark ? colors.primary[900] : colors.primary[50] }]}>
                    <User color={colors.primary[500]} size={24} />
                  </View>
                )}
                <View style={styles.menuUserInfo}>
                  <Text style={[styles.menuUserName, { color: colors.text.primary }]} numberOfLines={1}>
                    {profileName || 'Usuario'}
                  </Text>
                  <Text style={[styles.menuUserEmail, { color: colors.text.secondary }]} numberOfLines={1}>
                    {user?.email || ''}
                  </Text>
                </View>
              </View>

              <View style={[styles.menuDivider, { backgroundColor: colors.border.light }]} />

              {/* Opciones para usuario logueado */}
              <Pressable style={styles.menuItem} onPress={handleProfile}>
                <UserCircle color={colors.text.primary} size={20} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Mi perfil</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleFavorites}>
                <Heart color="#ef4444" size={20} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Mis favoritos</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleSettings}>
                <Settings color={colors.text.primary} size={20} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Configuración</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleSupport}>
                <HelpCircle color={colors.primary[500]} size={20} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Soporte</Text>
              </Pressable>

              <View style={[styles.menuDivider, { backgroundColor: colors.border.light }]} />

              <Pressable style={styles.menuItemDanger} onPress={handleLogout}>
                <LogOut color="#ef4444" size={20} />
                <Text style={styles.menuItemTextDanger}>Cerrar sesión</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Opciones para usuario no logueado */}
              <Pressable style={styles.menuItem} onPress={handleLogin}>
                <User color={colors.primary[500]} size={20} />
                <Text style={[styles.menuItemTextPrimary, { color: colors.primary[600] }]}>Iniciar sesión</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleRegister}>
                <UserCircle color={colors.text.primary} size={20} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Registrarse</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleSettings}>
                <Settings color={colors.text.primary} size={20} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Configuración</Text>
              </Pressable>

              <Pressable style={styles.menuItem} onPress={handleSupport}>
                <HelpCircle color={colors.primary[500]} size={20} />
                <Text style={[styles.menuItemText, { color: colors.text.primary }]}>Soporte</Text>
              </Pressable>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
});
