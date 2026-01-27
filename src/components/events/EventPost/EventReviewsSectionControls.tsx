import { memo } from 'react';
import { View, Pressable, Text } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface EventReviewsSectionControlsProps {
    hasReviews: boolean;
    reviewCount: number;
    isAuthenticated: boolean;
    hasUserReview: boolean;
    onToggleReviews: () => void;
    onWriteReview: () => void;
}

export const EventReviewsSectionControls = memo(function EventReviewsSectionControls({
    hasReviews,
    reviewCount,
    isAuthenticated,
    hasUserReview,
    onToggleReviews,
    onWriteReview,
}: EventReviewsSectionControlsProps) {
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
