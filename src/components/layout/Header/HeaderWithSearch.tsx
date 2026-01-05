import { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { User, LogIn } from 'lucide-react-native';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { LocationSearchBar, LocationSelection } from '../../ui';
import { UserMenu } from './UserMenu';
import { styles } from './styles';

/**
 * @example
 * // En tu _layout.tsx principal:
 * import { HeaderWithSearch } from '@/components/layout/Header/HeaderWithSearch';
 * 
 * <HeaderWithSearch />
 */
export const HeaderWithSearch = memo(function HeaderWithSearch() {
  const { user, isLoading, isAuthenticated } = useAuthUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleUserPress = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const handleLocationChange = useCallback((selection: LocationSelection) => {
    console.log('[HEADER] Ubicación seleccionada:', selection);

  }, []);

  return (
    <View style={styles.container}>
      {/* Fila 1: Logo + User Icon */}
      <View style={styles.topRow}>
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
      </View>

      {/* Fila 2: Buscador de Ubicación */}
      <View style={styles.searchRow}>
        <LocationSearchBar 
          onLocationChange={handleLocationChange}
          placeholder="Buscar por ubicación..."
        />
      </View>

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
