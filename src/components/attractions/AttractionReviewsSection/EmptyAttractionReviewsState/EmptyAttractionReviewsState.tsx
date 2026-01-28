import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';

interface EmptyAttractionReviewsStateProps {
    canWriteReview: boolean;
    isLoading: boolean;
    onWriteReview: () => void;
}

export const EmptyAttractionReviewsState = memo(function EmptyAttractionReviewsState({
    canWriteReview,
    isLoading,
    onWriteReview,
}: EmptyAttractionReviewsStateProps) {
    const colors = useThemedColors();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary[500]} />
            </View>
        );
    }

    return (
        <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.background.tertiary }]}>
                <MessageSquare size={24} color={colors.text.tertiary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                Sin reseñas
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                Sé el primero en compartir tu experiencia con esta atracción
            </Text>

            {canWriteReview && (
                <Pressable
                    style={[styles.writeButton, { backgroundColor: colors.primary[500] }]}
                    onPress={onWriteReview}
                >
                    <Text style={styles.writeButtonText}>Escribir reseña</Text>
                </Pressable>
            )}
        </View>
    );
});
