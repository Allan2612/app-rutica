import { memo } from 'react';
import { View, Text } from 'react-native';
import { MousePointerClick, Phone, TrendingUp, TrendingDown } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface ContactsSummaryCardsProps {
  colors: ThemedColors;
  totalClicks: number;
  growthPercentage: number;
  channelsCount: number;
}

export const ContactsSummaryCards = memo(function ContactsSummaryCards({
  colors,
  totalClicks,
  growthPercentage,
  channelsCount,
}: ContactsSummaryCardsProps) {
  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <View style={styles.summaryGrid}>
      {/* Total Clicks */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text.secondary }]}>Total</Text>
        <View style={[styles.summaryIconContainer, { backgroundColor: '#ede9fe' }]}>
          <MousePointerClick color="#8b5cf6" size={20} strokeWidth={2} />
        </View>
        <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{totalClicks}</Text>
        <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Interacciones</Text>
      </View>

      {/* Canales */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: colors.background.primary, borderColor: colors.border.light },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text.secondary }]}>Canales</Text>
        <View style={[styles.summaryIconContainer, { backgroundColor: '#dbeafe' }]}>
          <Phone color="#3b82f6" size={20} strokeWidth={2} />
        </View>
        <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{channelsCount}</Text>
        <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Activos</Text>
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
