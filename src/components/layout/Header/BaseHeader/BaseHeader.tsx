import { memo, useCallback, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, LogIn } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store';
import { useThemedColors } from '@/hooks';
import { UserMenu } from '@/components/layout/Header/UserMenu';
import { ThemeToggle } from '@/components/layout/Header/ThemeToggle';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { styles } from './styles';

interface BaseHeaderProps {
  showBorder?: boolean;
}

export const BaseHeader = memo(function BaseHeader({ showBorder = true }: BaseHeaderProps) {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const colors = useThemedColors();
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
    <SafeAreaView 
      style={[
        { backgroundColor: colors.background.primary, borderBottomWidth: 1, borderBottomColor: colors.border.light },
        !showBorder && { borderBottomWidth: 0 }
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
          <Text style={fontsLoaded ? [styles.logoText, { fontFamily: 'Caveat_700Bold', color: colors.primary[500] }] : [styles.logoText, { color: colors.primary[500] }]}>
            Rutica
          </Text>
        </Pressable>

        <View style={styles.rightControls}>
          <ThemeToggle />
          
          <Pressable
            style={styles.userButton}
            onPress={handleUserPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : isAuthenticated ? (
              <View style={[styles.userIconAuthenticated, { backgroundColor: colors.primary[500] }]}>
                <User color="#fff" size={20} />
              </View>
            ) : (
              <View style={[styles.userIconGuest, { backgroundColor: colors.background.tertiary }]}>
                <LogIn color={colors.text.secondary} size={20} />
              </View>
            )}
          </Pressable>
        </View>
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