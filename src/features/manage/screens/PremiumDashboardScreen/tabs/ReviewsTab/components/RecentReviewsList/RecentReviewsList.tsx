import { memo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Store, Package, Star, User, ChevronDown } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface RecentReview {
    id: string;
    type: 'business' | 'product';
    entityName: string;
    rating: number;
    comment?: string;
    authorName: string;
    createdAt: string;
}

interface RecentReviewsListProps {
    colors: ThemedColors;
    recentReviews: RecentReview[];
}

export const RecentReviewsList = memo(function RecentReviewsList({
    colors,
    recentReviews,
}: RecentReviewsListProps) {
    const [visibleCount, setVisibleCount] = useState(3);

    if (recentReviews.length === 0) return null;

    const displayedReviews = recentReviews.slice(0, visibleCount);
    const hasMore = visibleCount < recentReviews.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 5, recentReviews.length));
    };

    return (
        <View style={styles.listSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Reseñas Recientes</Text>
            <View style={styles.recentReviewsList}>
                {displayedReviews.map((review) => (
                    <View key={review.id} style={[styles.recentReviewCard, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
                        <View style={styles.recentReviewHeader}>
                            <View style={[styles.recentReviewType, { backgroundColor: review.type === 'business' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)' }]}>
                                {review.type === 'business' ? <Store color="#8b5cf6" size={14} strokeWidth={2} /> : <Package color="#10b981" size={14} strokeWidth={2} />}
                            </View>
                            <Text style={[styles.recentReviewEntity, { color: colors.text.primary }]} numberOfLines={1}>{review.entityName}</Text>
                            <View style={styles.recentReviewRating}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} color="#fbbf24" size={12} strokeWidth={2} fill={star <= review.rating ? '#fbbf24' : 'transparent'} />
                                ))}
                            </View>
                        </View>
                        {review.comment && (
                            <Text style={[styles.recentReviewComment, { color: colors.text.secondary }]} numberOfLines={2}>"{review.comment}"</Text>
                        )}
                        <View style={styles.recentReviewFooter}>
                            <View style={styles.recentReviewAuthor}>
                                <User color={colors.text.tertiary} size={12} strokeWidth={2} />
                                <Text style={[styles.recentReviewAuthorName, { color: colors.text.tertiary }]}>{review.authorName}</Text>
                            </View>
                            <Text style={[styles.recentReviewDate, { color: colors.text.tertiary }]}>
                                {new Date(review.createdAt).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {hasMore && (
                <TouchableOpacity
                    style={[styles.loadMoreButton, {
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.light
                    }]}
                    onPress={handleLoadMore}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.loadMoreText, { color: colors.text.primary }]}>
                        Ver más reseñas
                    </Text>
                    <ChevronDown color={colors.text.secondary} size={16} strokeWidth={2} />
                </TouchableOpacity>
            )}
        </View>
    );
});
