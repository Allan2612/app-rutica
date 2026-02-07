import { memo } from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface TopProduct {
    productId: string;
    productName: string;
    businessName: string;
    totalReviews: number;
    averageRating: number;
}

interface TopProductsListProps {
    colors: ThemedColors;
    topProducts: TopProduct[];
}

export const TopProductsList = memo(function TopProductsList({
    colors,
    topProducts,
}: TopProductsListProps) {
    if (topProducts.length === 0) return null;

    return (
        <View style={styles.listSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Top Productos Reseñados</Text>
            <View style={styles.topProductsList}>
                {topProducts.slice(0, 5).map((product, index) => (
                    <View key={product.productId} style={[styles.topProductCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                        <View style={[styles.topProductRank, { backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#cd7f32' : colors.border.light }]}>
                            <Text style={[styles.topProductRankText, { color: index < 3 ? '#ffffff' : colors.text.secondary }]}>{index + 1}</Text>
                        </View>
                        <View style={styles.topProductInfo}>
                            <Text style={[styles.topProductName, { color: colors.text.primary }]} numberOfLines={1}>{product.productName}</Text>
                            <Text style={[styles.topProductBusiness, { color: colors.text.tertiary }]} numberOfLines={1}>{product.businessName}</Text>
                        </View>
                        <View style={styles.topProductStats}>
                            <View style={styles.topProductRating}>
                                <Star color="#fbbf24" size={14} strokeWidth={2} fill="#fbbf24" />
                                <Text style={[styles.topProductRatingText, { color: colors.text.primary }]}>{product.averageRating.toFixed(1)}</Text>
                            </View>
                            <Text style={[styles.topProductReviewCount, { color: colors.text.tertiary }]}>{product.totalReviews} reseñas</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
});
