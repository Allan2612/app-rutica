import { memo } from 'react';
import { View, Text } from 'react-native';
import { Star, MessageSquare, MapPin, Store, Calendar, Package } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ReviewStatsCardsProps {
    totalReviews: number;
    averageRating: number;
    byType: {
        attraction: number;
        business: number;
        event: number;
        product: number;
    };
}

export const ReviewStatsCards = memo<ReviewStatsCardsProps>(function ReviewStatsCards({
    totalReviews,
    averageRating,
    byType,
}) {
    const colors = useThemedColors();

    return (
        <View style={styles.container}>
            {/* Total Reviews Card */}
            <View
                style={[
                    styles.statCard,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.medium,
                    },
                ]}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.info + '15' }]}>
                    <MessageSquare color={colors.info} size={20} strokeWidth={2} />
                </View>
                <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                        {totalReviews.toLocaleString()}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        Total reseñas
                    </Text>
                </View>
            </View>

            {/* Average Rating Card */}
            <View
                style={[
                    styles.statCard,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.medium,
                    },
                ]}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.rating.star + '15' }]}>
                    <Star color={colors.rating.star} size={20} strokeWidth={2} fill={colors.rating.star} />
                </View>
                <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                        {averageRating.toFixed(1)}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        Promedio general
                    </Text>
                </View>
            </View>

            {/* Attractions */}
            <View
                style={[
                    styles.statCard,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.medium,
                    },
                ]}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.reviewTypes.attraction + '15' }]}>
                    <MapPin color={colors.reviewTypes.attraction} size={20} strokeWidth={2} />
                </View>
                <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                        {byType.attraction}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        Atracciones
                    </Text>
                </View>
            </View>

            {/* Businesses */}
            <View
                style={[
                    styles.statCard,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.medium,
                    },
                ]}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.reviewTypes.business + '15' }]}>
                    <Store color={colors.reviewTypes.business} size={20} strokeWidth={2} />
                </View>
                <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                        {byType.business}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        Negocios
                    </Text>
                </View>
            </View>

            {/* Events */}
            <View
                style={[
                    styles.statCard,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.medium,
                    },
                ]}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.reviewTypes.event + '15' }]}>
                    <Calendar color={colors.reviewTypes.event} size={20} strokeWidth={2} />
                </View>
                <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                        {byType.event}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        Eventos
                    </Text>
                </View>
            </View>

            {/* Products */}
            <View
                style={[
                    styles.statCard,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.medium,
                    },
                ]}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.reviewTypes.product + '15' }]}>
                    <Package color={colors.reviewTypes.product} size={20} strokeWidth={2} />
                </View>
                <View style={styles.statContent}>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                        {byType.product}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                        Productos
                    </Text>
                </View>
            </View>
        </View>
    );
});
