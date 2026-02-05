import { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Store, Package, Star, TrendingUp } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors, ReviewType } from '../../../../../../../../types/entities/premium';

interface RatingDistribution {
    stars5: number;
    stars4: number;
    stars3: number;
    stars2: number;
    stars1: number;
}

interface ReviewsSummaryCardsProps {
    colors: ThemedColors;
    totalBusinessReviews: number;
    totalProductReviews: number;
    overallAverageRating: number;
    reviewType: ReviewType;
    totalDistribution: RatingDistribution;
}

export const ReviewsSummaryCards = memo(function ReviewsSummaryCards({
    colors,
    totalBusinessReviews,
    totalProductReviews,
    overallAverageRating,
    reviewType,
    totalDistribution,
}: ReviewsSummaryCardsProps) {
    // Calcular porcentaje de reseñas positivas (4 y 5 estrellas)
    const positivePercentage = useMemo(() => {
        const total = totalDistribution.stars5 + totalDistribution.stars4 +
            totalDistribution.stars3 + totalDistribution.stars2 +
            totalDistribution.stars1;
        if (total === 0) return 0;
        const positive = totalDistribution.stars5 + totalDistribution.stars4;
        return Math.round((positive / total) * 100);
    }, [totalDistribution]);

    return (
        <View style={styles.summaryGrid}>
            {reviewType !== 'product' && (
                <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                    <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                        <Store color="#8b5cf6" size={22} strokeWidth={2} />
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{totalBusinessReviews}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Reseñas de Negocios</Text>
                </View>
            )}

            {reviewType !== 'business' && (
                <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                    <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                        <Package color="#10b981" size={22} strokeWidth={2} />
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{totalProductReviews}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Reseñas de Productos</Text>
                </View>
            )}

            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                    <Star color="#fbbf24" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{overallAverageRating.toFixed(1)}</Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Promedio General</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <TrendingUp color="#10b981" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{positivePercentage}%</Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Reseñas Positivas</Text>
            </View>
        </View>
    );
});
