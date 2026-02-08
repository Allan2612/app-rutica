import { memo, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { useUserSubscriptionDetails } from '@/hooks/useUserSubscriptions';
import { useAuthStore } from '@/store';
import { PremiumModal } from '@/components/user/PremiumModal/PremiumModal';
import type { SubscriptionType } from '@/types/enums';
import {
  HeaderSection,
  DashboardCard,
  FullPremiumCard,
  AvailablePlansSection,
  MyPackagesSection,
} from './components';
import { styles } from './styles';

export const PremiumHubScreen = memo(function PremiumHubScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const { data: subscriptions = [], isLoading, refetch } = useUserSubscriptionDetails();
  const userRole = useAuthStore((state) => state.role);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionType | undefined>(undefined);

  // Refrescar suscripciones cuando la pantalla recibe foco
  useRefreshOnFocus(refetch);

  const handleDashboardPress = useCallback(() => {
    router.push('/(app)/(tabs)/manage/premium/dashboard' as any);
  }, [router]);

  const handleOpenPremiumModal = useCallback((planType?: SubscriptionType) => {
    setSelectedPlan(planType);
    setShowPremiumModal(true);
  }, []);

  const handleClosePremiumModal = useCallback(() => {
    setShowPremiumModal(false);
    setSelectedPlan(undefined);
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
        <HeaderSection />

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
          </View>
        )}

        {/* Available Plans (when no subscriptions) */}
        {!isLoading && subscriptions.length === 0 && (
          <AvailablePlansSection onBuyPress={handleOpenPremiumModal} />
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
        {!isLoading && <MyPackagesSection subscriptions={otherSubscriptions} />}

        {/* Acquire Package Button */}
        {!isLoading && (
          <Pressable
            style={[styles.acquireButton, { backgroundColor: colors.primary[500] }]}
            onPress={() => handleOpenPremiumModal()}
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
        initialPlan={selectedPlan}
      />
    </View>
  );
});

