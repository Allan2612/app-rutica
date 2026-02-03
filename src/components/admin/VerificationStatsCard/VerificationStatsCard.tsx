import { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Store, CalendarDays, Landmark, Tag, Clock } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { TYPE_LABELS, type VerificationEntityType } from '@/features/admin/types';
import { styles } from './styles';

export interface VerificationStatsCardProps {
  totalPending: number;
  pendingByType: {
    business: number;
    event: number;
    attraction: number;
    promotion: number;
  };
}

const TYPE_ICONS: Record<VerificationEntityType, typeof Store> = {
  business: Store,
  event: CalendarDays,
  attraction: Landmark,
  promotion: Tag,
};

export const VerificationStatsCard = memo(function VerificationStatsCard({
  totalPending,
  pendingByType,
}: VerificationStatsCardProps) {
  const colors = useThemedColors();

  // Colors from theme - no hardcoded values
  const STAT_ITEMS = useMemo(() => {
    const entityTypes: VerificationEntityType[] = ['business', 'event', 'attraction', 'promotion'];
    return entityTypes.map((key) => ({
      key,
      label: TYPE_LABELS[key],
      icon: TYPE_ICONS[key],
      color: colors.entityTypes[key].text,
      bgColor: colors.entityTypes[key].bg,
    }));
  }, [colors.entityTypes]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.border.medium,
        },
      ]}
    >
      <View style={styles.header}>
        <Clock color={colors.warning} size={20} strokeWidth={2} />
        <Text style={[styles.title, { color: colors.text.primary }]}>Solicitudes Pendientes</Text>
        <View
          style={[
            styles.totalBadge,
            { backgroundColor: totalPending > 0 ? colors.warning : colors.success },
          ]}
        >
          <Text style={[styles.totalText, { color: colors.text.inverse }]}>{totalPending}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {STAT_ITEMS.map((item) => {
          const Icon = item.icon;
          const count = pendingByType[item.key];

          return (
            <View
              key={item.key}
              style={[
                styles.statItem,
                { backgroundColor: colors.background.secondary },
              ]}
            >
              <View style={[styles.statIconContainer, { backgroundColor: item.bgColor }]}>
                <Icon color={item.color} size={18} strokeWidth={2} />
              </View>
              <View style={styles.statInfo}>
                <Text style={[styles.statLabel, { color: colors.text.tertiary }]}>
                  {item.label}
                </Text>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>{count}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
});
