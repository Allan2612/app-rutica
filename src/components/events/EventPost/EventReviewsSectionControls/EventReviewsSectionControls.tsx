import { memo, useCallback } from 'react';
import { View, Pressable, Text, Share, Platform } from 'react-native';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { useIsEventLiked, useEventLikesCount } from '@/features/events/hooks/useEventLikes';
import { useToggleEventLike } from '@/features/events/hooks/useToggleEventLike';
import { styles } from '../styles';

interface EventReviewsSectionControlsProps {
    eventId: string;
    eventName: string;
    hasReviews: boolean;
    reviewCount: number;
    showReviews: boolean;
    isAuthenticated: boolean;
    hasUserReview: boolean;
    onToggleReviews: () => void;
    onWriteReview: () => void;
}

export const EventReviewsSectionControls = memo(function EventReviewsSectionControls({
    eventId,
    eventName,
    hasReviews,
    reviewCount,
    showReviews,
    isAuthenticated,
    hasUserReview,
    onToggleReviews,
    onWriteReview,
}: EventReviewsSectionControlsProps) {
    const colors = useThemedColors();
    const userId = useAuthStore((state) => state.user?.id);
    
    // Likes
    const isLiked = useIsEventLiked(eventId, userId);
    const { data: likesCount = 0 } = useEventLikesCount(eventId);
    const toggleLike = useToggleEventLike();

    const handleLikePress = useCallback(() => {
        if (!isAuthenticated || !userId) {
            Toast.show({
                type: 'error',
                text1: 'Iniciar sesión',
                text2: 'Debes iniciar sesión para poder dejar tu me gusta',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }
        toggleLike.mutate({ eventId, userId });
    }, [eventId, userId, isAuthenticated, toggleLike]);

    const handleShare = useCallback(async () => {
        try {
            const shareMessage = `¡Mira este evento en Rutica! ${eventName}`;
            
            if (Platform.OS === 'web') {
                // En web usar navigator.share si está disponible
                if (navigator.share) {
                    await navigator.share({
                        title: eventName,
                        text: shareMessage,
                        url: window.location.href,
                    });
                } else {
                    // Fallback: copiar al portapapeles
                    await navigator.clipboard.writeText(`${shareMessage}\n${window.location.href}`);
                    Toast.show({
                        type: 'success',
                        text1: 'Enlace copiado',
                        text2: 'El enlace ha sido copiado al portapapeles',
                        position: 'top',
                    });
                }
            } else {
                // En móvil usar Share de React Native
                await Share.share({
                    message: shareMessage,
                    title: eventName,
                });
            }
        } catch (error) {
            console.log('[EventReviewsSectionControls] Share cancelled or error:', error);
        }
    }, [eventName]);

    const likeColor = isLiked ? '#1877f2' : colors.text.secondary;

    return (
        <View style={[styles.actionsBar, { borderTopColor: colors.border.light }]}>
            {/* Like Button */}
            <Pressable 
                style={styles.actionButton} 
                onPress={handleLikePress}
                disabled={toggleLike.isPending}
            >
                <ThumbsUp 
                    size={20} 
                    color={likeColor}
                    fill={isLiked ? '#1877f2' : 'transparent'}
                />
                <Text style={[styles.actionButtonText, { color: likeColor }]}>
                    Me gusta {likesCount > 0 ? `(${likesCount})` : ''}
                </Text>
            </Pressable>

            {/* Comment Button */}
            <Pressable style={styles.actionButton} onPress={onToggleReviews}>
                <MessageCircle size={20} color={colors.text.secondary} />
                <Text style={[styles.actionButtonText, { color: colors.text.secondary }]}>
                    Comentar {reviewCount > 0 ? `(${reviewCount})` : ''}
                </Text>
            </Pressable>

            {/* Share Button */}
            <Pressable style={styles.actionButton} onPress={handleShare}>
                <Share2 size={20} color={colors.text.secondary} />
                <Text style={[styles.actionButtonText, { color: colors.text.secondary }]}>
                    Compartir
                </Text>
            </Pressable>
        </View>
    );
});
