import { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { User, LogIn } from 'lucide-react-native';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { UserMenu } from './UserMenu';
import { styles } from './styles';

export const Header = memo(function Header() {
  const { user, isLoading, isAuthenticated } = useAuthUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleUserPress = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo + Nombre */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Rutica</Text>
      </View>

      {/* User Icon */}
      <Pressable
        style={styles.userButton}
        onPress={handleUserPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#10b981" />
        ) : isAuthenticated ? (
          <View style={styles.userIconAuthenticated}>
            <User color="#fff" size={20} />
          </View>
        ) : (
          <View style={styles.userIconGuest}>
            <LogIn color="#666" size={20} />
          </View>
        )}
      </Pressable>

      {/* User Menu */}
      <UserMenu
        visible={menuVisible}
        onClose={handleCloseMenu}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    </View>
  );
});
