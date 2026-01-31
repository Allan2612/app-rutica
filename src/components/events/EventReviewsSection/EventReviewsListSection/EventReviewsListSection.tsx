import { memo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { EventReviewItem } from '@/components/events/EventPost';
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

    const getInitials = useCallback((name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    const getTimeAgo = useCallback((dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);

        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
        if (diffMonths === 1) return 'Hace 1 mes';
        if (diffMonths < 12) return `Hace ${diffMonths} meses`;
        return `Hace ${Math.floor(diffMonths / 12)} años`;
    }, []);

    return (
        <View style={styles.reviewsList}>
            {/* User's review first if exists */}
            {userReview && (
                <EventReviewItem
                    review={userReview}
                    isOwner={true}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}

            {/* Other reviews */}
            {reviews
                .filter((review) => review.userId !== currentUserId)
                .map((review) => (
                    <EventReviewItem
                        key={review.id}
                        review={review}
                        isOwner={false}
                        onEdit={() => {}}
                        onDelete={() => {}}
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
