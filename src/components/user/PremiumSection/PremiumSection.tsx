import { memo, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Crown } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useSubscriptions } from '@/features/user/hooks/useSubscriptions';
import { getSubscriptionPlanInfo } from '@/types/entities';
import { SubscriptionCard } from './SubscriptionCard';
import { LoadMoreButton } from './LoadMoreButton';
import { NoSubscriptionView } from './NoSubscriptionView';
import { AddMorePlansButton } from './AddMorePlansButton';
import { styles } from './styles';

interface PremiumSectionProps {
  onSubscribePress: () => void;
}

export const PremiumSection = memo(function PremiumSection({
  onSubscribePress,
}: PremiumSectionProps) {
  const colors = useThemedColors();
  const { approvedSubscriptions, pendingSubscriptions, isPremium, isLoading } = useSubscriptions();
  const [visibleCount, setVisibleCount] = useState(3);

  // Obtener información de todos los planes aprobados
  const approvedPlans = approvedSubscriptions
    .map((sub) => ({
      subscription: sub,
      planInfo: sub.subscription?.type_sub
        ? getSubscriptionPlanInfo(sub.subscription.type_sub)
        : null,
      status: 'approved' as const,
    }))
    .filter((item) => item.planInfo);

  // Obtener información de planes pendientes
  const pendingPlans = pendingSubscriptions
    .map((sub) => ({
      subscription: sub,
      planInfo: sub.subscription?.type_sub
        ? getSubscriptionPlanInfo(sub.subscription.type_sub)
        : null,
      status: 'pending' as const,
    }))
    .filter((item) => item.planInfo);

  // Combinar todas las suscripciones (aprobadas primero, luego pendientes)
  const allPlans = useMemo(() => {
    return [...approvedPlans, ...pendingPlans];
  }, [approvedSubscriptions, pendingSubscriptions]);

  // Obtener planes visibles según paginación
  const visiblePlans = useMemo(() => {
    return allPlans.slice(0, visibleCount);
  }, [allPlans, visibleCount]);

  const hasMore = allPlans.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, allPlans.length));
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.border.light,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.border.light,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Crown size={22} color={colors.warning} />
          <Text style={[styles.title, { color: colors.text.primary }]}>Premium</Text>
        </View>
        {isPremium && (
          <View style={[styles.badge, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.badgeText, { color: colors.success }]}>Activo</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {isPremium || pendingPlans.length > 0 ? (
          <>
            {visiblePlans.map(({ subscription, planInfo, status }, index) => (
              <SubscriptionCard
                key={subscription.id_psub}
                subscription={subscription}
                planInfo={planInfo!}
                status={status}
                isFirst={index === 0}
                colors={colors}
              />
            ))}

            {hasMore && <LoadMoreButton onPress={handleLoadMore} colors={colors} />}
          </>
        ) : (
          <NoSubscriptionView onSubscribePress={onSubscribePress} colors={colors} />
        )}

        {(isPremium || pendingPlans.length > 0) && (
          <AddMorePlansButton onPress={onSubscribePress} colors={colors} />
        )}
      </View>
    </View>
  );
});
