import { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogIn } from 'lucide-react-native';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useLocation, LocationSelection } from '../../../hooks';
import { LocationSearchBar } from '../../ui';
import { UserMenu } from './UserMenu';
import { styles } from './styles';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';

/**
 * @example
 * // En tu _layout.tsx principal:
 * import { HeaderWithSearch } from '@/components/layout/Header/HeaderWithSearch';
 * 
 * <HeaderWithSearch />
 */
export const HeaderWithSearch = memo(function HeaderWithSearch() {
  const { user, isLoading, isAuthenticated } = useAuthUser();
  const { updateLocation, saveToDatabase } = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Caveat_700Bold,
  });

  const handleUserPress = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const handleLocationChange = useCallback(async (selection: LocationSelection) => {
    console.log('[HEADER] Ubicación seleccionada:', selection);
    // Actualizar store global
    updateLocation({
      province: selection.province,
      canton: selection.canton,
      district: selection.district,
      coordinates: selection.coordinates,
      address: selection.address,
      searchText: selection.searchText,
    });
    // TODO: Descomentar cuando esté lista la integración con BD
    // await saveToDatabase();
  }, [updateLocation]);

  if (!fontsLoaded) {
    return <Text>Cargando...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Fila 1: Logo + User Icon */}
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={fontsLoaded ? [styles.logoText, { fontFamily: 'Caveat_700Bold' }] : styles.logoText}>Rutica</Text>
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
    </SafeAreaView>
  );
});
