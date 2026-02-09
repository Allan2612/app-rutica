import { memo, useCallback } from 'react';
import { View, Pressable, Text, Share, Platform } from 'react-native';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import {
  useIsAttractionLiked,
  useAttractionLikesCount,
} from '@/features/attractions/hooks/useAttractionLikes';
import { useToggleAttractionLike } from '@/features/attractions/hooks/useToggleAttractionLike';
import { styles } from '../styles';

interface ReviewsSectionControlsProps {
  attractionId: string;
  attractionName: string;
  hasReviews: boolean;
  reviewCount: number;
  showReviews: boolean;
  isAuthenticated: boolean;
  hasUserReview: boolean;
  onToggleReviews: () => void;
  onWriteReview: () => void;
}

export const ReviewsSectionControls = memo(function ReviewsSectionControls({
  attractionId,
  attractionName,
  hasReviews,
  reviewCount,
  showReviews,
  isAuthenticated,
  hasUserReview,
  onToggleReviews,
  onWriteReview,
}: ReviewsSectionControlsProps) {
  const colors = useThemedColors();
  const userId = useAuthStore((state) => state.user?.id);

  // Likes
  const isLiked = useIsAttractionLiked(attractionId);
  const { data: likesCount = 0 } = useAttractionLikesCount(attractionId);
  const toggleLike = useToggleAttractionLike();

  const handleLikePress = useCallback(() => {
    if (!isAuthenticated) {
      Toast.show({
        type: 'error',
        text1: 'Iniciar sesión',
        text2: 'Debes iniciar sesión para poder dejar tu me gusta',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    toggleLike.mutate(attractionId);
  }, [attractionId, isAuthenticated, toggleLike]);

  const handleShare = useCallback(async () => {
    try {
      const shareMessage = `¡Mira esta atracción en Rutica! ${attractionName}`;

      // Construir el URL de detalles de la atracción
      const detailUrl =
        Platform.OS === 'web'
          ? `${window.location.origin}/(app)/(tabs)/attractions/${attractionId}`
          : `rutica://attractions/${attractionId}`;

      if (Platform.OS === 'web') {
        // En web usar navigator.share si está disponible
        if (navigator.share) {
          await navigator.share({
            title: attractionName,
            text: shareMessage,
            url: detailUrl,
          });
        } else {
          // Fallback: copiar al portapapeles
          await navigator.clipboard.writeText(`${shareMessage}\n${detailUrl}`);
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
          message: `${shareMessage}\n${detailUrl}`,
          title: attractionName,
        });
      }
    } catch (error) {
      // Share cancelled or error
    }
  }, [attractionName, attractionId]);

  const likeColor = isLiked ? '#1877f2' : colors.text.secondary;

  return (
    <View style={[styles.actionsBar, { borderTopColor: colors.border.light }]}>
      {/* Like Button */}
      <Pressable
        style={styles.actionButton}
        onPress={handleLikePress}
        disabled={toggleLike.isPending}
      >
        <ThumbsUp size={20} color={likeColor} fill={isLiked ? '#1877f2' : 'transparent'} />
        <Text style={[styles.actionButtonText, { color: likeColor }]}>
          Me gusta{likesCount > 0 ? ` (${likesCount})` : ''}
        </Text>
      </Pressable>

      {/* Comment Button - Despliega comentarios */}
      <Pressable style={styles.actionButton} onPress={onToggleReviews}>
        <MessageCircle size={20} color={colors.text.secondary} />
        <Text style={[styles.actionButtonText, { color: colors.text.secondary }]}>
          Comentar{reviewCount > 0 ? ` (${reviewCount})` : ''}
        </Text>
      </Pressable>

      {/* Share Button */}
      <Pressable style={styles.actionButton} onPress={handleShare}>
        <Share2 size={20} color={colors.text.secondary} />
        <Text style={[styles.actionButtonText, { color: colors.text.secondary }]}>Compartir</Text>
      </Pressable>
    </View>
  );
});
