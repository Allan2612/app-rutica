import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewCard } from '@/components/business/ReviewCard';
import { styles } from '../styles';
import type { EventReviewDisplay } from '@/services/eventReviews.service';

interface EventReviewsListProps {
    reviews: EventReviewDisplay[];
    userReview: EventReviewDisplay | null;
    currentUserId: string | null;
    canWriteReview: boolean;
    isDeleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onWriteReview: () => void;
}

export const EventReviewsList = memo(function EventReviewsList({
    reviews,
    userReview,
    currentUserId,
    canWriteReview,
    isDeleting,
    onEdit,
    onDelete,
    onWriteReview,
}: EventReviewsListProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.reviewsList}>
            {/* User's review first if exists */}
            {userReview && (
                <ReviewCard
                    authorName={userReview.authorName}
                    rating={userReview.rating}
                    comment={userReview.comment}
                    createdAt={userReview.createdAt}
                    isOwner={true}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                />
            )}

            {/* Other reviews */}
            {reviews
                .filter((review) => review.userId !== currentUserId)
                .map((review) => (
                    <ReviewCard
                        key={review.id}
                        authorName={review.authorName}
                        rating={review.rating}
                        comment={review.comment}
                        createdAt={review.createdAt}
                    />
                ))}

            {/* Write Review Button (only for users without review) */}
            {canWriteReview && (
                <Pressable
                    style={[styles.writeButtonOutline, { borderColor: colors.primary[500] }]}
                    onPress={onWriteReview}
                >
                    <Text style={[styles.writeButtonOutlineText, { color: colors.primary[500] }]}>
                        Escribir reseña
                    </Text>
                </Pressable>
            )}
        </View>
    );
});
