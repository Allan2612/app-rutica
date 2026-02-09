import { memo, useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { UserSubscriptionDetail } from '@/services/userSubscriptions.service';
import { SubscriptionCard } from '../SubscriptionCard';
import { styles } from './styles';

type PackageFilter = 'active' | 'consumed';

interface MyPackagesSectionProps {
  subscriptions: UserSubscriptionDetail[];
}

export const MyPackagesSection = memo(function MyPackagesSection({
  subscriptions,
}: MyPackagesSectionProps) {
  const colors = useThemedColors();
  const [packageFilter, setPackageFilter] = useState<PackageFilter>('active');

  // Separar paquetes en activos y consumidos
  const { activePackages, consumedPackages } = useMemo(() => {
    const active: UserSubscriptionDetail[] = [];
    const consumed: UserSubscriptionDetail[] = [];

    subscriptions.forEach((sub) => {
      // Un paquete está consumido si todos sus recursos están al máximo
      const isConsumed =
        sub.usageDetails.length > 0 &&
        sub.usageDetails.every((usage) => usage.usedCount >= usage.maxQuota);

      if (isConsumed) {
        consumed.push(sub);
      } else {
        active.push(sub);
      }
    });

    return { activePackages: active, consumedPackages: consumed };
  }, [subscriptions]);

  // Paquetes a mostrar según el filtro
  const displayedPackages = packageFilter === 'active' ? activePackages : consumedPackages;

  if (subscriptions.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Mis Paquetes</Text>
        <View style={styles.filterTabs}>
          <Pressable
            style={[
              styles.filterTab,
              {
                backgroundColor:
                  packageFilter === 'active' ? colors.primary[500] : colors.background.tertiary,
              },
            ]}
            onPress={() => setPackageFilter('active')}
          >
            <Text
              style={[
                styles.filterTabText,
                {
                  color: packageFilter === 'active' ? '#FFFFFF' : colors.text.secondary,
                },
              ]}
            >
              Activos ({activePackages.length})
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterTab,
              {
                backgroundColor:
                  packageFilter === 'consumed' ? colors.primary[500] : colors.background.tertiary,
              },
            ]}
            onPress={() => setPackageFilter('consumed')}
          >
            <Text
              style={[
                styles.filterTabText,
                {
                  color: packageFilter === 'consumed' ? '#FFFFFF' : colors.text.secondary,
                },
              ]}
            >
              Consumidos ({consumedPackages.length})
            </Text>
          </Pressable>
        </View>
      </View>
      {displayedPackages.length > 0 ? (
        displayedPackages.map((subscription) => (
          <SubscriptionCard key={subscription.id} subscription={subscription} />
        ))
      ) : (
        <Text style={[styles.emptyPackagesText, { color: colors.text.tertiary }]}>
          {packageFilter === 'active'
            ? 'No tienes paquetes activos.'
            : 'No tienes paquetes consumidos.'}
        </Text>
      )}
    </View>
  );
});
