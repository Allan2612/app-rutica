import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewItem } from '../ReviewItem';
import { styles } from '../styles';
import type { AttractionReviewDisplay } from '@/services/attractionReviews.service';

interface ReviewsListProps {
    reviews: AttractionReviewDisplay[];
    currentUserId: string | null;
    isAuthenticated: boolean;
    hasUserReview: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onWriteReview: () => void;
    getInitials: (name: string) => string;
    getTimeAgo: (date: string) => string;
}

export const ReviewsList = memo(function ReviewsList({
    reviews,
    currentUserId,
    isAuthenticated,
    hasUserReview,
    onEdit,
    onDelete,
    onWriteReview,
    getInitials,
    getTimeAgo,
}: ReviewsListProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.reviewsList, { borderTopColor: colors.border.light }]}>
            {/* Si no hay reseñas, mostrar mensaje y botón */}
            {reviews.length === 0 ? (
                <View style={styles.emptyReviewsContainer}>
                    <Text style={[styles.emptyReviewsText, { color: colors.text.tertiary }]}>
                        Sin reseñas aún. ¡Sé el primero en compartir tu experiencia!
                    </Text>
                    {isAuthenticated && (
                        <Pressable
                            style={[styles.writeReviewButtonLarge, { backgroundColor: colors.primary[500] }]}
                            onPress={onWriteReview}
                        >
                            <Text style={styles.writeReviewButtonLargeText}>
                                Escribir reseña
                            </Text>
                        </Pressable>
                    )}
                </View>
            ) : (
                <>
                    {/* Lista de reseñas */}
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

                    {/* Botón escribir reseña al final solo si el usuario no tiene reseña */}
                    {isAuthenticated && !hasUserReview && (
                        <View style={styles.emptyReviewsContainer}>
                            <Pressable
                                style={[styles.writeReviewButtonLarge, { backgroundColor: colors.primary[500] }]}
                                onPress={onWriteReview}
                            >
                                <Text style={styles.writeReviewButtonLargeText}>
                                    Escribir reseña
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </>
            )}
        </View>
    );
});
