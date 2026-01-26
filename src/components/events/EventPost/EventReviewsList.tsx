import { memo } from 'react';
import { View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { EventReviewItem } from './EventReviewItem';
import { styles } from './styles';
import type { EventReviewDisplay } from '@/services/eventReviews.service';

interface EventReviewsListProps {
    reviews: EventReviewDisplay[];
    currentUserId: string | null;
    onEdit: () => void;
    onDelete: () => void;
}

export const EventReviewsList = memo(function EventReviewsList({
    reviews,
    currentUserId,
    onEdit,
    onDelete,
}: EventReviewsListProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.reviewsList, { borderTopColor: colors.border.light }]}>
            {reviews.map((review) => {
                const isOwner = review.userId === currentUserId;
                return (
                    <EventReviewItem
                        key={review.id}
                        review={review}
                        isOwner={isOwner}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                );
            })}
        </View>
    );
});
