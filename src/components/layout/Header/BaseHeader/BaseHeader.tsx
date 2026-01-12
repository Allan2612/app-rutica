import { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogIn } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store';
import { UserMenu } from '@/components/layout/Header/UserMenu';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { styles } from './styles';
import { colors } from '@/styles/theme/colors';

interface BaseHeaderProps {
  showBorder?: boolean;
}

export const BaseHeader = memo(function BaseHeader({ showBorder = true }: BaseHeaderProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore();
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

  const handleLogoPress = useCallback(() => {
    router.push('/(app)/(tabs)/home');
  }, []);

  if (!fontsLoaded) {
    return <Text>Cargando...</Text>;
  }

  return (
    <SafeAreaView style={[styles.container, !showBorder && styles.containerNoBorder]} edges={['top']}>
      <View style={styles.topRow}>
        <Pressable style={styles.logoContainer} onPress={handleLogoPress}>
          <Image
            source={require('../../../../../assets/logo.png')}
            style={styles.logoImage}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
          <Text style={fontsLoaded ? [styles.logoText, { fontFamily: 'Caveat_700Bold' }] : styles.logoText}>
            Rutica
          </Text>
        </Pressable>

        <Pressable
          style={styles.userButton}
          onPress={handleUserPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary[500]} />
          ) : isAuthenticated ? (
            <View style={styles.userIconAuthenticated}>
              <User color="#fff" size={20} />
            </View>
          ) : (
            <View style={styles.userIconGuest}>
              <LogIn color={colors.text.secondary} size={20} />
            </View>
          )}
        </Pressable>
      </View>

      <UserMenu
        visible={menuVisible}
        onClose={handleCloseMenu}
        user={user}
        isAuthenticated={isAuthenticated}
      />
    </SafeAreaView>
  );
});