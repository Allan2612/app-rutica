import { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Store, CalendarDays, Landmark, Tag, Clock } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
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

export const VerificationStatsCard = memo(function VerificationStatsCard({
  totalPending,
  pendingByType,
}: VerificationStatsCardProps) {
  const colors = useThemedColors();

  // Colors that adapt to dark mode
  const STAT_ITEMS = useMemo(() => [
    {
      key: 'business' as const,
      label: 'Negocios',
      icon: Store,
      color: colors.isDark ? '#60a5fa' : '#3b82f6',
      bgColor: colors.isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe',
    },
    {
      key: 'event' as const,
      label: 'Eventos',
      icon: CalendarDays,
      color: colors.isDark ? '#fbbf24' : '#f59e0b',
      bgColor: colors.isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
    },
    {
      key: 'attraction' as const,
      label: 'Atracciones',
      icon: Landmark,
      color: colors.isDark ? '#34d399' : '#10b981',
      bgColor: colors.isDark ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5',
    },
    {
      key: 'promotion' as const,
      label: 'Promociones',
      icon: Tag,
      color: colors.isDark ? '#f472b6' : '#ec4899',
      bgColor: colors.isDark ? 'rgba(236, 72, 153, 0.15)' : '#fce7f3',
    },
  ], [colors.isDark]);

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
          <Text style={[styles.totalText, { color: '#fff' }]}>{totalPending}</Text>
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
