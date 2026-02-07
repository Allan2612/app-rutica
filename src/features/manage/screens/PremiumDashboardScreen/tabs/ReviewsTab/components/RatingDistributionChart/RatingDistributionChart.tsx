import { memo } from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { styles } from './styles';
import { RATING_COLORS } from '@/styles/premium-section-styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface RatingDistribution {
    stars5: number;
    stars4: number;
    stars3: number;
    stars2: number;
    stars1: number;
}

interface RatingDistributionChartProps {
    colors: ThemedColors;
    totalDistribution: RatingDistribution;
}

export const RatingDistributionChart = memo(function RatingDistributionChart({
    colors,
    totalDistribution,
}: RatingDistributionChartProps) {
    const totalReviewsDistribution = totalDistribution.stars5 + totalDistribution.stars4 +
        totalDistribution.stars3 + totalDistribution.stars2 + totalDistribution.stars1;

    if (totalReviewsDistribution === 0) return null;

    const distributionData = [
        { stars: 5, count: totalDistribution.stars5, color: RATING_COLORS.stars5 },
        { stars: 4, count: totalDistribution.stars4, color: RATING_COLORS.stars4 },
        { stars: 3, count: totalDistribution.stars3, color: RATING_COLORS.stars3 },
        { stars: 2, count: totalDistribution.stars2, color: RATING_COLORS.stars2 },
        { stars: 1, count: totalDistribution.stars1, color: RATING_COLORS.stars1 },
    ];

    const maxCount = Math.max(...distributionData.map(d => d.count), 1);

    return (
        <View style={[styles.chartCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            <View style={styles.chartHeader}>
                <View style={[styles.chartIconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                    <Star color="#fbbf24" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Distribución de Calificaciones</Text>
            </View>
            <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
                Cantidad de reseñas por número de estrellas
            </Text>
            <View style={{ paddingVertical: 16 }}>
                {distributionData.map((item) => {
                    const barWidthPercent = (item.count / maxCount) * 100;
                    const showNumberInside = barWidthPercent >= 20;
                    return (
                        <View key={item.stars} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 8 }}>
                            <View style={{ flexDirection: 'row', width: 80, alignItems: 'center', gap: 2 }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text.primary, marginRight: 4 }}>{item.stars}</Text>
                                <Star color="#fbbf24" size={14} strokeWidth={2} fill="#fbbf24" />
                            </View>
                            <View style={{ flex: 1, position: 'relative' }}>
                                <View style={{ width: '100%', height: 28, backgroundColor: `${colors.border.light}25`, borderRadius: 6 }}>
                                    <View style={{ width: `${barWidthPercent}%`, height: '100%', backgroundColor: item.color, borderRadius: 6, justifyContent: 'center', alignItems: 'center', minWidth: showNumberInside ? 35 : 0 }}>
                                        {showNumberInside && <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>{item.count}</Text>}
                                    </View>
                                </View>
                                {!showNumberInside && item.count > 0 && (
                                    <Text style={{ position: 'absolute', left: `${barWidthPercent}%`, top: 0, bottom: 0, marginLeft: 8, lineHeight: 28, color: colors.text.primary, fontSize: 12, fontWeight: '700' }}>
                                        {item.count}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
});
