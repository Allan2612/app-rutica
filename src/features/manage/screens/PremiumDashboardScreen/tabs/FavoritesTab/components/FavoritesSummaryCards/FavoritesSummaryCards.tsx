import { memo } from 'react';
import { View, Text } from 'react-native';
import { Heart, Calendar, TrendingUp, TrendingDown } from 'lucide-react-native';
import { styles } from './styles';
import type { PeakDayData, ThemedColors } from '../../../../../../../../types/entities/premium';

interface FavoritesSummaryCardsProps {
  colors: ThemedColors;
  totalFavorites: number;
  peakDay: PeakDayData | null;
  growthPercentage: number;
  isPositiveGrowth: boolean;
}

export const FavoritesSummaryCards = memo(function FavoritesSummaryCards({
  colors,
  totalFavorites,
  peakDay,
  growthPercentage,
  isPositiveGrowth,
}: FavoritesSummaryCardsProps) {
  return (
    <View style={styles.summaryGrid}>
      {/* Total Favoritos */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text.secondary }]}>Total</Text>
        <View style={[styles.summaryIconContainer, { backgroundColor: '#fee2e2' }]}>
          <Heart color="#ef4444" size={20} strokeWidth={2} fill="#ef4444" />
        </View>
        <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{totalFavorites}</Text>
        <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Favoritos</Text>
      </View>

      {/* Día con Mayor Actividad */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text.secondary }]}>Más actividad</Text>
        <View style={[styles.summaryIconContainer, { backgroundColor: '#dbeafe' }]}>
          <Calendar color="#3b82f6" size={20} strokeWidth={2} />
        </View>
        {peakDay ? (
          <>
            <Text
              style={[
                styles.summaryValue,
                { color: colors.text.primary, fontSize: 16, paddingTop: 8 },
              ]}
            >
              {peakDay.formattedDate}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
              {peakDay.count} favorito{peakDay.count !== 1 ? 's' : ''}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.summaryValue, { color: colors.text.primary }]}>-</Text>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
              Sin actividad
            </Text>
          </>
        )}
      </View>

      {/* Crecimiento */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text.secondary }]}>Crecimiento</Text>
        <View
          style={[
            styles.summaryIconContainer,
            { backgroundColor: isPositiveGrowth ? '#d1fae5' : '#fee2e2' },
          ]}
        >
          {isPositiveGrowth ? (
            <TrendingUp color="#10b981" size={20} strokeWidth={2} />
          ) : (
            <TrendingDown color="#ef4444" size={20} strokeWidth={2} />
          )}
        </View>
        <Text style={[styles.summaryValue, { color: isPositiveGrowth ? '#10b981' : '#ef4444' }]}>
          {isPositiveGrowth ? '+' : ''}
          {growthPercentage}%
        </Text>
        <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>vs. Semana Ant.</Text>
      </View>
    </View>
  );
});
