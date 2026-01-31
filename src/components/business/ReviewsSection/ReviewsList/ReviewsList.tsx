import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewCard } from '@/components/business/ReviewCard';
import { styles } from '../styles';
import type { BusinessReviewDisplay } from '@/services/businessReviews.service';

interface ReviewsListProps {
    reviews: BusinessReviewDisplay[];
    userReview: BusinessReviewDisplay | null;
    currentUserId: string | null;
    canWriteReview: boolean;
    isDeleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onWriteReview: () => void;
}

export const ReviewsList = memo(function ReviewsList({
    reviews,
    userReview,
    currentUserId,
    canWriteReview,
    isDeleting,
    onEdit,
    onDelete,
    onWriteReview,
}: ReviewsListProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.reviewsList}>
            {/* User's review first if exists */}
            {userReview && (
                <ReviewCard
                    id={userReview.id}
                    authorName={userReview.authorName}
                    rating={userReview.rating}
                    comment={userReview.comment}
                    createdAt={userReview.createdAt}
                    likesCount={userReview.likesCount}
                    isLikedByUser={userReview.isLikedByUser}
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
                        id={review.id}
                        authorName={review.authorName}
                        rating={review.rating}
                        comment={review.comment}
                        createdAt={review.createdAt}
                        likesCount={review.likesCount}
                        isLikedByUser={review.isLikedByUser}
                    />
                ))}

            {/* Write Review Button (only for buyers without review) */}
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
