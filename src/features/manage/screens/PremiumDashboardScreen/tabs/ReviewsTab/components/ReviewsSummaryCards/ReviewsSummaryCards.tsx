import { memo } from 'react';
import { View, Text } from 'react-native';
import { Store, Package, Star, MessageSquare } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface ReviewsSummaryCardsProps {
    colors: ThemedColors;
    totalBusinessReviews: number;
    totalProductReviews: number;
    overallAverageRating: number;
}

export const ReviewsSummaryCards = memo(function ReviewsSummaryCards({
    colors,
    totalBusinessReviews,
    totalProductReviews,
    overallAverageRating,
}: ReviewsSummaryCardsProps) {
    return (
        <View style={styles.summaryGrid}>
            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                    <Store color="#8b5cf6" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{totalBusinessReviews}</Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Reseñas de Negocios</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Package color="#10b981" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{totalProductReviews}</Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Reseñas de Productos</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.15)' }]}>
                    <Star color="#fbbf24" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{overallAverageRating.toFixed(1)}</Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Promedio General</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                <View style={[styles.summaryIconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                    <MessageSquare color="#3b82f6" size={22} strokeWidth={2} />
                </View>
                <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{totalBusinessReviews + totalProductReviews}</Text>
                <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Total Reseñas</Text>
            </View>
        </View>
    );
});
