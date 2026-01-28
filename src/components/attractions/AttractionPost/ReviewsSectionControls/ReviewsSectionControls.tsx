import { memo } from 'react';
import { View, Pressable, Text } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';

interface ReviewsSectionControlsProps {
    hasReviews: boolean;
    reviewCount: number;
    showReviews: boolean;
    isAuthenticated: boolean;
    hasUserReview: boolean;
    onToggleReviews: () => void;
    onWriteReview: () => void;
}

export const ReviewsSectionControls = memo(function ReviewsSectionControls({
    hasReviews,
    reviewCount,
    showReviews,
    isAuthenticated,
    hasUserReview,
    onToggleReviews,
    onWriteReview,
}: ReviewsSectionControlsProps) {
    const colors = useThemedColors();

    return (
        <View style={[styles.reviewsSection, { borderTopColor: colors.border.light }]}>
            <Pressable style={styles.reviewsToggle} onPress={onToggleReviews}>
                <MessageCircle size={18} color={colors.text.secondary} />
                <Text style={[styles.reviewsToggleText, { color: colors.text.secondary }]}>
                    {hasReviews ? `Ver ${reviewCount} reseña${reviewCount === 1 ? '' : 's'}` : 'Sin reseñas'}
                </Text>
            </Pressable>

            {isAuthenticated && (
                <Pressable
                    style={[styles.writeReviewButton, { backgroundColor: colors.primary[500] }]}
                    onPress={onWriteReview}
                >
                    <Text style={styles.writeReviewButtonText}>
                        {hasUserReview ? 'Editar mi reseña' : 'Escribir reseña'}
                    </Text>
                </Pressable>
            )}
        </View>
    );
});
