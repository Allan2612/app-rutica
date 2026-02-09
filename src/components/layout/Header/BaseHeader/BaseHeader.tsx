import { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, useWindowDimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogIn, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore, useLocationStore } from '@/store';
import { useThemedColors, useProfilePhoto } from '@/hooks';
import { UserMenu } from '@/components/layout/Header/UserMenu';
import { LocationDropdown } from '@/components/layout/Header/LocationDropdown';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { styles } from './styles';

interface BaseHeaderProps {
  showBorder?: boolean;
}

export const BaseHeader = memo(function BaseHeader({ showBorder = true }: BaseHeaderProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const { location } = useLocationStore();
  const colors = useThemedColors();
  const profilePhotoUrl = useProfilePhoto(user?.id);
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [fontsLoaded] = useFonts({
    Caveat_700Bold,
  });

  const handleUserPress = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const handleLocationPress = useCallback(() => {
    setLocationVisible(true);
  }, []);

  const handleCloseLocation = useCallback(() => {
    setLocationVisible(false);
  }, []);

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleLogoPress = useCallback(() => {
    router.push('/(app)/(tabs)/home');
  }, []);

  const getLocationText = () => {
    if (!location) return 'Costa Rica';

    // En mobile mostrar solo distrito o cantón
    if (isMobile) {
      return location.district || location.canton || location.province || 'Costa Rica';
    }

    // En pantallas grandes mostrar todo
    const parts = [location.district, location.canton, location.province].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Costa Rica';
  };

  if (!fontsLoaded) {
    return null;
  }

  const headerShadow = showBorder
    ? Platform.select({
        web: { boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)' } as any,
        default: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 4,
        },
      })
    : {};

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: colors.background.primary,
          borderBottomWidth: 0,
          ...headerShadow,
        },
      ]}
      edges={['top']}
    >
      <View style={styles.topRow}>
        <Pressable style={styles.logoContainer} onPress={handleLogoPress}>
          <Image
            source={require('../../../../../assets/logo.png')}
            style={styles.logoImage}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
          <Text
            style={
              fontsLoaded
                ? [styles.logoText, { fontFamily: 'Caveat_700Bold', color: colors.primary[500] }]
                : [styles.logoText, { color: colors.primary[500] }]
            }
          >
            Rutica
          </Text>
        </Pressable>

        <View style={styles.rightControls}>
          <Pressable style={styles.locationContainer} onPress={handleLocationPress}>
            <View
              style={[
                styles.locationTextContainer,
                {
                  backgroundColor: colors.background.tertiary,
                  maxWidth: isMobile ? 120 : 250,
                },
              ]}
            >
              <Text style={[styles.locationText, { color: colors.primary[500] }]} numberOfLines={1}>
                {getLocationText()}
              </Text>
            </View>
            <View style={[styles.locationIcon, { backgroundColor: colors.background.tertiary }]}>
              <MapPin color={colors.primary[600]} size={20} />
            </View>
          </Pressable>

          <Pressable style={styles.userButton} onPress={handleUserPress} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : isAuthenticated ? (
              profilePhotoUrl ? (
                <Image
                  source={{ uri: profilePhotoUrl }}
                  style={styles.userIconAuthenticated}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <View
                  style={[styles.userIconAuthenticated, { backgroundColor: colors.primary[500] }]}
                >
                  <User color="#fff" size={20} />
                </View>
              )
            ) : (
              <View style={[styles.userIconGuest, { backgroundColor: colors.background.tertiary }]}>
                <LogIn color={colors.text.secondary} size={20} />
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <LocationDropdown visible={locationVisible} onClose={handleCloseLocation} />

      <UserMenu
        visible={menuVisible}
        onClose={handleCloseMenu}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    </SafeAreaView>
  );
});
