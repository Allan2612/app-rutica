import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { SubscriptionStats as StatsType } from '../../../../services/adminSubscriptions.service';
import { styles } from './styles';

interface SubscriptionStatsProps {
  stats: StatsType;
}

export const SubscriptionStats = memo(function SubscriptionStats({
  stats,
}: SubscriptionStatsProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.statsContainer}>
      <View
        style={[
          styles.statCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.statLabel, { color: '#eab308' }]}>Pendientes</Text>
        <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.pending}</Text>
      </View>
      <View
        style={[
          styles.statCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.statLabel, { color: '#10b981' }]}>Aprobadas</Text>
        <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.approved}</Text>
      </View>
      <View
        style={[
          styles.statCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.statLabel, { color: '#ef4444' }]}>Rechazadas</Text>
        <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.rejected}</Text>
      </View>
      <View
        style={[
          styles.statCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Total</Text>
        <Text style={[styles.statValue, { color: colors.text.primary }]}>{stats.total}</Text>
      </View>
    </View>
  );
});
