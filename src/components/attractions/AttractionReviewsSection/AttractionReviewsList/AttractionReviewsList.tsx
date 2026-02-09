import { memo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewCard } from '@/components/business/ReviewCard';
import { useToggleAttractionReviewLike } from '@/features/attractions/hooks/useToggleAttractionReviewLike';
import { styles } from '../styles';
import type { AttractionReviewDisplay } from '@/services/attractionReviews.service';

interface AttractionReviewsListProps {
    reviews: AttractionReviewDisplay[];
    userReview: AttractionReviewDisplay | null;
    currentUserId: string | null;
    canWriteReview: boolean;
    isDeleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onWriteReview: () => void;
}

export const AttractionReviewsList = memo(function AttractionReviewsList({
    reviews,
    userReview,
    currentUserId,
    canWriteReview,
    isDeleting,
    onEdit,
    onDelete,
    onWriteReview,
}: AttractionReviewsListProps) {
    const colors = useThemedColors();
    const toggleLike = useToggleAttractionReviewLike();

    const handleLikeToggle = useCallback((reviewId: string) => {
        toggleLike.mutate(reviewId);
    }, [toggleLike]);

    return (
        <View style={styles.reviewsList}>
            {/* User's review first if exists */}
            {userReview && (
                <ReviewCard
                    id={userReview.id}
                    authorName={userReview.authorName}
                    authorId={userReview.userId}
                    rating={userReview.rating}
                    comment={userReview.comment}
                    createdAt={userReview.createdAt}
                    likesCount={userReview.likesCount}
                    isLikedByUser={userReview.isLikedByUser}
                    isOwner={true}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting}
                    onLikeToggle={handleLikeToggle}
                    isLikeToggling={toggleLike.isPending}
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
                        authorId={review.userId}
                        rating={review.rating}
                        comment={review.comment}
                        createdAt={review.createdAt}
                        likesCount={review.likesCount}
                        isLikedByUser={review.isLikedByUser}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onLikeToggle={handleLikeToggle}
                        isLikeToggling={toggleLike.isPending}
                    />
                ))}

            {/* Write Review Button (only for users without review) */}
            {canWriteReview && (
                <Pressable
                    style={[styles.writeButtonOutline, { borderColor: colors.primary[500] }]}
                    onPress={onWriteReview}
                >
                    <Text style={[styles.writeButtonOutlineText, { color: colors.primary[500] }]}>
                        Añadir comentario
                    </Text>
                </Pressable>
            )}
        </View>
    );
});
