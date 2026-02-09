/**
 * CallToAction Component
 * Encouraging section for sellers to create their business
 */

import { memo, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Store, ArrowRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { styles } from './styles';

export const CallToAction = memo(function CallToAction() {
  const colors = useThemedColors();
  const { isAuthenticated, role } = useAuthStore();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const handlePress = useCallback(() => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
    } else if (role === 'buyer') {
      // Buyers can still see info but might need to upgrade
      router.push('/(app)/(tabs)/manage');
    } else {
      router.push('/(app)/(tabs)/manage/businesses');
    }
  }, [isAuthenticated, role]);

  // Don't show CTA to sellers/admins who already have access
  if (isAuthenticated && (role === 'seller' || role === 'admin')) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.card, { transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        onPress={handlePress}
      >
        <LinearGradient
          colors={
            colors.isDark ? ['#065f46', '#047857', '#059669'] : ['#059669', '#10b981', '#34d399']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Decorative Elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          {/* Content */}
          <View style={[styles.content, isMobile && styles.contentMobile]}>
            <View style={styles.iconContainer}>
              <Store size={32} color="#FFFFFF" strokeWidth={1.5} />
              <View style={styles.sparkleContainer}>
                <Sparkles size={16} color="#fbbf24" fill="#fbbf24" />
              </View>
            </View>

            <View style={[styles.textContainer, isMobile && styles.textContainerMobile]}>
              <Text style={styles.title}>
                {isAuthenticated ? 'Publica tu negocio' : 'Tienes un negocio?'}
              </Text>
              <Text style={styles.subtitle}>
                {isAuthenticated
                  ? 'Llega a miles de clientes en tu zona'
                  : 'Unete a Rutica y promociona tu comercio'}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>{isAuthenticated ? 'Comenzar' : 'Saber mas'}</Text>
                <ArrowRight size={18} color="#059669" strokeWidth={2.5} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
});
