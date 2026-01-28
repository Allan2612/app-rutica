import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star, Edit3, Trash2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';
import type { AttractionReviewDisplay } from '@/services/attractionReviews.service';

interface ReviewItemProps {
    review: AttractionReviewDisplay;
    isOwner: boolean;
    onEdit: () => void;
    onDelete: () => void;
    getInitials: (name: string) => string;
    getTimeAgo: (date: string) => string;
}

export const ReviewItem = memo(function ReviewItem({
    review,
    isOwner,
    onEdit,
    onDelete,
    getInitials,
    getTimeAgo,
}: ReviewItemProps) {
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
                            {getTimeAgo(review.createdAt)}
                        </Text>
                    </View>
                </View>
                {isOwner && (
                    <ReviewActions onEdit={onEdit} onDelete={onDelete} />
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

function ReviewActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    const colors = useThemedColors();

    return (
        <View style={styles.reviewActions}>
            <Pressable style={styles.reviewActionButton} onPress={onEdit}>
                <Edit3 size={16} color={colors.primary[500]} />
            </Pressable>
            <Pressable style={styles.reviewActionButton} onPress={onDelete}>
                <Trash2 size={16} color="#dc2626" />
            </Pressable>
        </View>
    );
}
