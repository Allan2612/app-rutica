import { memo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import {
  Crown,
  ChevronRight,
  Tag,
  BarChart3,
  Images,
  Package,
  Sparkles,
  Camera,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useUserActiveSubscriptions } from '@/hooks/useUserSubscriptions';
import { BackButton } from '@/components/ui';
import type { SubscriptionType } from '@/types/enums';
import { styles } from './styles';

// Configuración de iconos y colores por tipo de suscripción
const SUBSCRIPTION_CONFIG: Record<
  SubscriptionType,
  {
    icon: typeof Crown;
    iconColor: string;
    iconBg: string;
    route?: string;
  }
> = {
  promotions: {
    icon: Tag,
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    route: '/(app)/(tabs)/manage/promotions',
  },
  dashboard: {
    icon: BarChart3,
    iconColor: '#3b82f6',
    iconBg: '#dbeafe',
    route: '/(app)/(tabs)/manage/premium/dashboard',
  },
  gallery_business: {
    icon: Images,
    iconColor: '#8b5cf6',
    iconBg: '#ede9fe',
    route: '/(app)/(tabs)/manage/businesses',
  },
  package_products: {
    icon: Package,
    iconColor: '#10b981',
    iconBg: '#d1fae5',
    route: '/(app)/(tabs)/manage/businesses',
  },
  gallery_attractions: {
    icon: Camera,
    iconColor: '#ec4899',
    iconBg: '#fce7f3',
    route: '/(app)/(tabs)/manage/attractions',
  },
  full_premium: {
    icon: Sparkles,
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    route: undefined, // Full premium no tiene ruta específica
  },
};

export const PremiumHubScreen = memo(function PremiumHubScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: subscriptions = [], isLoading } = useUserActiveSubscriptions();

  const handleCardPress = (route?: string) => {
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
          <View style={styles.headerRow}>
            <BackButton href="/(app)/(tabs)/manage" />
            <View style={styles.headerContent}>
              <View style={styles.titleRow}>
                <Crown color="#f59e0b" size={24} strokeWidth={2} />
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                  Mi Premium
                </Text>
              </View>
              <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                Tus beneficios activos y herramientas premium.
              </Text>
            </View>
          </View>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        )}

        {/* Empty State */}
        {!isLoading && subscriptions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Crown color={colors.text.tertiary} size={64} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              Sin suscripciones activas
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
              Aún no tienes suscripciones premium aprobadas.
              Contacta a soporte para más información.
            </Text>
          </View>
        )}

        {/* Subscriptions Grid */}
        {!isLoading && subscriptions.length > 0 && (
          <View style={styles.grid}>
            {subscriptions.map((subscription) => {
              const config = SUBSCRIPTION_CONFIG[subscription.subscriptionType];
              const Icon = config?.icon ?? Crown;
              const iconColor = config?.iconColor ?? '#f59e0b';
              const iconBg = config?.iconBg ?? '#fef3c7';
              const route = config?.route;

              return (
                <Pressable
                  key={subscription.id}
                  style={({ pressed }) => [
                    styles.subscriptionCard,
                    {
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.medium,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => handleCardPress(route)}
                  disabled={!route}
                >
                  <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                    <Icon color={iconColor} size={24} strokeWidth={2} />
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                      {subscription.subscriptionName}
                    </Text>
                    <Text
                      style={[styles.cardDescription, { color: colors.text.secondary }]}
                      numberOfLines={2}
                    >
                      {subscription.subscriptionDescription}
                    </Text>
                  </View>

                  {route && (
                    <ChevronRight
                      color={colors.text.tertiary}
                      size={20}
                      strokeWidth={2}
                      style={styles.chevron}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Features Section - Solo si hay full_premium */}
        {!isLoading &&
          subscriptions.some((s) => s.subscriptionType === 'full_premium') && (
            <View style={styles.featuresSection}>
              <Text style={[styles.featuresTitle, { color: colors.text.primary }]}>
                Beneficios Premium Completo
              </Text>
              <View style={[styles.featuresList, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                {subscriptions
                  .find((s) => s.subscriptionType === 'full_premium')
                  ?.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <View style={[styles.featureBullet, { backgroundColor: '#f59e0b' }]} />
                      <Text style={[styles.featureText, { color: colors.text.secondary }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
      </ScrollView>
    </View>
  );
});
