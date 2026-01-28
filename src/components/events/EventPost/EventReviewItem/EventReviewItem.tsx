import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star, Edit3, Trash2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';
import type { EventReviewDisplay } from '@/services/eventReviews.service';

interface EventReviewItemProps {
    review: EventReviewDisplay;
    isOwner: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

function getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

function getTimeAgoForReview(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 1) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}

export const EventReviewItem = memo(function EventReviewItem({
    review,
    isOwner,
    onEdit,
    onDelete,
}: EventReviewItemProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.reviewItem, { backgroundColor: colors.background.secondary }]}>
            <View style={styles.reviewHeader}>
                <View style={[styles.reviewAvatar, { backgroundColor: colors.primary[100] }]}>
                    <Text style={[styles.reviewAvatarText, { color: colors.primary[700] }]}>
                        {getInitials(review.authorName)}
                    </Text>
                </View>
                <View style={styles.reviewInfo}>
                    <Text style={[styles.reviewAuthor, { color: colors.text.primary }]}>
                        {review.authorName}
                        {isOwner && <Text style={{ color: colors.primary[500] }}> (Tú)</Text>}
                    </Text>
                    <View style={styles.reviewMeta}>
                        <View style={styles.reviewStars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={12}
                                    color="#fbbf24"
                                    fill={star <= review.rating ? '#fbbf24' : 'transparent'}
                                />
                            ))}
                        </View>
                        <Text style={[styles.reviewDate, { color: colors.text.tertiary }]}>
                            {getTimeAgoForReview(review.createdAt)}
                        </Text>
                    </View>
                </View>
                {isOwner && (
                    <View style={styles.reviewActions}>
                        <Pressable style={styles.reviewActionButton} onPress={onEdit}>
                            <Edit3 size={16} color={colors.primary[500]} />
                        </Pressable>
                        <Pressable style={styles.reviewActionButton} onPress={onDelete}>
                            <Trash2 size={16} color="#dc2626" />
                        </Pressable>
                    </View>
                )}
            </View>
            {review.comment && (
                <Text style={[styles.reviewComment, { color: colors.text.secondary }]}>
                    {review.comment}
                </Text>
            )}
        </View>
    );
});
