import { memo } from 'react';
import { View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewItem } from '../ReviewItem';
import { styles } from '../styles';
import type { AttractionReviewDisplay } from '@/services/attractionReviews.service';

interface ReviewsListProps {
    reviews: AttractionReviewDisplay[];
    currentUserId: string | null;
    onEdit: () => void;
    onDelete: () => void;
    getInitials: (name: string) => string;
    getTimeAgo: (date: string) => string;
}

export const ReviewsList = memo(function ReviewsList({
    reviews,
    currentUserId,
    onEdit,
    onDelete,
    getInitials,
    getTimeAgo,
}: ReviewsListProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.reviewsList, { borderTopColor: colors.border.light }]}>
            {reviews.map((review) => {
                const isOwner = review.userId === currentUserId;
                return (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        isOwner={isOwner}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        getInitials={getInitials}
                        getTimeAgo={getTimeAgo}
                    />
                );
            })}
        </View>
    );
});
