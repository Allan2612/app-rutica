/**
 * HeroWelcome Component
 * Creative welcome header for the Home screen
 * Uses Caveat font like Rutica branding
 */

import { memo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { useThemedColors } from '@/hooks';
import { useAuthStore, useLocationStore } from '@/store';
import { styles } from './styles';

interface HeroWelcomeProps {
  businessCount: number;
  eventCount: number;
  attractionCount: number;
  promotionCount: number;
}

export const HeroWelcome = memo(function HeroWelcome({
  businessCount,
  eventCount,
  attractionCount,
  promotionCount,
}: HeroWelcomeProps) {
  const colors = useThemedColors();
  const { user } = useAuthStore();
  const { location } = useLocationStore();
  const { width } = useWindowDimensions();
  const [fontsLoaded, fontError] = useFonts({ Caveat_700Bold });

  const isMobile = width < 768;

  const getLocationText = () => {
    if (!location) return 'Costa Rica';
    const parts = [location.district, location.canton, location.province].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Costa Rica';
  };

  // Si hay error o no carga, usar fuente por defecto
  const useFallbackFont = !fontsLoaded || fontError;

  const locationText = getLocationText();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={
          colors.isDark
            ? ['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)', 'transparent']
            : ['rgba(16, 185, 129, 0.12)', 'rgba(16, 185, 129, 0.04)', 'transparent']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo and Brand */}
        <View style={styles.brandRow}>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.logo}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
          <View style={styles.brandTextContainer}>
            <Text
              style={[
                styles.brandName,
                useFallbackFont ? { fontWeight: '700' } : { fontFamily: 'Caveat_700Bold' },
                { color: colors.primary[500] },
              ]}
            >
              Rutica
            </Text>
            <Text style={[styles.brandTagline, { color: colors.text.secondary }]}>
              Descubre Costa Rica
            </Text>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text
            style={[
              styles.welcomeMessage,
              { color: colors.text.primary },
              isMobile && styles.welcomeMessageMobile,
            ]}
          >
            Explora lo mejor de tu zona
          </Text>
        </View>

        {/* Location Badge */}
        <View
          style={[
            styles.locationBadge,
            {
              backgroundColor: colors.isDark
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(16, 185, 129, 0.1)',
              borderColor: colors.primary[500] + '30',
            },
          ]}
        >
          <MapPin size={16} color={colors.primary[500]} strokeWidth={2} />
          <Text style={[styles.locationText, { color: colors.primary[600] }]}>{locationText}</Text>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsContainer, isMobile && styles.statsContainerMobile]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary[500] }]}>{businessCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Negocios</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border.medium }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary[500] }]}>{eventCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Eventos</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border.medium }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary[500] }]}>
              {attractionCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Atracciones</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border.medium }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary[500] }]}>
              {promotionCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Promociones</Text>
          </View>
        </View>
      </View>
    </View>
  );
});
