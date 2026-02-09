import { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Activity, Heart, Clock } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { styles } from './styles';
import type {
  ChartDataItem,
  PeriodType,
  ThemedColors,
} from '../../../../../../../../types/entities/premium';

interface FavoritesTrendChartProps {
  colors: ThemedColors;
  lineChartData: ChartDataItem[];
  period: PeriodType;
}

export const FavoritesTrendChart = memo(function FavoritesTrendChart({
  colors,
  lineChartData,
  period,
}: FavoritesTrendChartProps) {
  // Filtrar solo los días con actividad (valor > 0)
  const activeDays = lineChartData.filter((item) => item.value > 0);

  if (activeDays.length === 0) return null;

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.background.primary, borderColor: colors.border.light },
      ]}
    >
      <View style={styles.chartHeader}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
          <Activity color="#ef4444" size={20} strokeWidth={2} />
        </View>
        <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
          Actividad de Favoritos
        </Text>
      </View>
      <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
        {activeDays.length} {activeDays.length === 1 ? 'día' : 'días'} con actividad en los últimos{' '}
        {period} días
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {activeDays.map((day, index) => {
          // Formatear label con mes completo
          let formattedLabel = day.label;
          let timeLabel = '';

          if (day.label.includes(':')) {
            // Si el label ya incluye hora (formato: "30 - 14:00")
            const parts = day.label.split(' - ');
            formattedLabel = parts[0];
            timeLabel = parts[1] || '';
          }

          return (
            <View
              key={`${day.label}-${index}`}
              style={[
                styles.dayCard,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.light,
                },
              ]}
            >
              <View style={[styles.dayIconBadge, { backgroundColor: '#fee2e2' }]}>
                <Heart color="#ef4444" size={16} strokeWidth={2} fill="#ef4444" />
              </View>
              <Text style={[styles.dayValue, { color: colors.text.primary }]}>{day.value}</Text>
              {timeLabel && (
                <View style={styles.timeContainer}>
                  <Clock color={colors.text.tertiary} size={10} strokeWidth={2} />
                  <Text style={[styles.timeLabel, { color: colors.text.tertiary }]}>
                    {timeLabel}
                  </Text>
                </View>
              )}
              <Text style={[styles.dayLabel, { color: colors.text.secondary }]}>
                {formattedLabel}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
});
