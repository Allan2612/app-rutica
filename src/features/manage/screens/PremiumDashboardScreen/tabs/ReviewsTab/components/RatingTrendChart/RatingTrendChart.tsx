import { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TrendingUp, Star } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { styles } from './styles';
import type { ThemedColors, PeriodType } from '../../../../../../../../types/entities/premium';

interface RatingTrendItem {
  label: string;
  count: number;
  averageRating: number;
  date?: string;
}

interface RatingTrendChartProps {
  colors: ThemedColors;
  ratingTrend: RatingTrendItem[];
  period: PeriodType;
}

export const RatingTrendChart = memo(function RatingTrendChart({
  colors,
  ratingTrend,
  period,
}: RatingTrendChartProps) {
  // Filtrar solo los días con actividad (count > 0)
  const activeDays = ratingTrend.filter((item) => item.count > 0);

  if (activeDays.length === 0) return null;

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.background.primary, borderColor: colors.border.light },
      ]}
    >
      <View style={styles.chartHeader}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
          <TrendingUp color="#fbbf24" size={20} strokeWidth={2} />
        </View>
        <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
          Actividad de Calificaciones
        </Text>
      </View>
      <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
        {activeDays.length} {activeDays.length === 1 ? 'día' : 'días'} con reseñas en los últimos{' '}
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

          // Si el label incluye hora (formato: "30 - 14:00"), extraer solo el día
          if (day.label.includes(' - ')) {
            const parts = day.label.split(' - ');
            formattedLabel = parts[0];
          }

          // Formatear con mes completo si existe la fecha
          if (day.date) {
            try {
              formattedLabel = format(new Date(day.date), 'd MMMM', { locale: es });
            } catch {
              // Mantener el label original si hay error
            }
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
              <View style={[styles.dayIconBadge, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                <Star color="#fbbf24" size={16} strokeWidth={2} fill="#fbbf24" />
              </View>
              <Text style={[styles.dayValue, { color: '#fbbf24' }]}>
                {day.averageRating.toFixed(1)}
              </Text>
              <Text style={[styles.dayCount, { color: colors.text.tertiary }]}>
                {day.count} {day.count === 1 ? 'reseña' : 'reseñas'}
              </Text>
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
