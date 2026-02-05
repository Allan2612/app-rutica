import { memo } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Star } from 'lucide-react-native';
import { styles } from './styles';
import type { ReviewPieDataItem, ThemedColors } from '../../../../../../../../types/entities/premium';

interface ReviewsPieChartProps {
    colors: ThemedColors;
    reviewPieData: ReviewPieDataItem[];
    overallAverageRating: number;
    selectedBusinessId: string | null;
}

export const ReviewsPieChart = memo(function ReviewsPieChart({
    colors,
    reviewPieData,
    overallAverageRating,
    selectedBusinessId,
}: ReviewsPieChartProps) {
    if (reviewPieData.length === 0) return null;

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <Star color="#fbbf24" size={20} strokeWidth={2} fill="#fbbf24" />
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Resumen de Calificaciones</Text>
            </View>
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                {selectedBusinessId === null ? 'Proporción de reseñas según su calificación' : 'Proporción de reseñas para este negocio'}
            </Text>
            <View style={styles.pieContainer}>
                <View style={styles.pieChartWrapper}>
                    <PieChart
                        data={reviewPieData}
                        donut
                        radius={80}
                        innerRadius={50}
                        centerLabelComponent={() => (
                            <View style={styles.pieCenter}>
                                <Text style={[styles.pieCenterValue, { color: '#000000' }]}>{overallAverageRating.toFixed(1)}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                    <Star color="#fbbf24" size={12} strokeWidth={2} fill="#fbbf24" />
                                    <Text style={[styles.pieCenterLabel, { color: colors.text.secondary }]}>Promedio</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View style={styles.legendContainer}>
                    {reviewPieData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                            <Text numberOfLines={1} style={[styles.legendLabel, { color: colors.text.secondary }]}>{item.label}</Text>
                            <Text style={[styles.legendValue, { color: colors.text.primary }]}>{item.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
});
