import { memo, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Crown, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useUserSubscriptionDetails } from '@/hooks/useUserSubscriptions';
import { useAuthStore } from '@/store';
import { BackButton } from '@/components/ui';
import { PremiumModal } from '@/components/user/PremiumModal/PremiumModal';
import { SubscriptionCard } from './components/SubscriptionCard';
import { DashboardCard } from './components/DashboardCard';
import { FullPremiumCard } from './components/FullPremiumCard';
import { AvailablePlansSection } from './components/AvailablePlansSection';
import { styles } from './styles';

export const PremiumHubScreen = memo(function PremiumHubScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: subscriptions = [], isLoading, refetch } = useUserSubscriptionDetails();
  const userRole = useAuthStore((state) => state.role);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleDashboardPress = () => {
    router.push('/(app)/(tabs)/manage/premium/dashboard' as any);
  };

  const handleOpenPremiumModal = useCallback(() => {
    setShowPremiumModal(true);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setShowPremiumModal(false);
  }, []);

  const handlePremiumSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  // Separar suscripciones por tipo
  const fullPremiumSubscriptions = subscriptions.filter(
    (s) => s.subscriptionType === 'full_premium'
  );
  const dashboardSubscriptions = subscriptions.filter(
    (s) => s.subscriptionType === 'dashboard'
  );
  const otherSubscriptions = subscriptions.filter(
    (s) => s.subscriptionType !== 'dashboard' && s.subscriptionType !== 'full_premium'
  );

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
                Gestiona tus suscripciones y consulta el uso de cada paquete.
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

        {/* Available Plans (when no subscriptions) */}
        {!isLoading && subscriptions.length === 0 && (
          <AvailablePlansSection onBuyPress={() => handleOpenPremiumModal()} />
        )}

        {/* Dashboard Cards */}
        {!isLoading && dashboardSubscriptions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Dashboard Analítico
            </Text>
            {dashboardSubscriptions.map((subscription) => (
              <DashboardCard
                key={subscription.id}
                subscription={subscription}
                onPress={handleDashboardPress}
              />
            ))}
          </View>
        )}

        {/* Full Premium Cards */}
        {!isLoading && fullPremiumSubscriptions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Premium Completo
            </Text>
            {fullPremiumSubscriptions.map((subscription) => (
              <FullPremiumCard
                key={subscription.id}
                subscription={subscription}
                onDashboardPress={handleDashboardPress}
              />
            ))}
          </View>
        )}

        {/* Other Subscriptions */}
        {!isLoading && otherSubscriptions.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Mis Paquetes
            </Text>
            {otherSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </View>
        )}

        {/* Acquire Package Button */}
        {!isLoading && (
          <Pressable
            style={[styles.acquireButton, { backgroundColor: colors.primary[500] }]}
            onPress={handleOpenPremiumModal}
          >
            <Plus color="#FFFFFF" size={20} strokeWidth={2} />
            <Text style={styles.acquireButtonText}>Adquirir Paquete</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={handleClosePremiumModal}
        onSubscribed={handlePremiumSuccess}
        userRole={userRole}
      />
    </View>
  );
});

