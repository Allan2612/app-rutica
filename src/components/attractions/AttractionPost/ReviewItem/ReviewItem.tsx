import { memo, useCallback } from 'react';
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star, Edit3, Trash2, ThumbsUp } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { useIsAttractionReviewLiked } from '@/features/attractions/hooks/useAttractionReviewLikes';
import { useToggleAttractionReviewLike } from '@/features/attractions/hooks/useToggleAttractionReviewLike';
import { isAdmin } from '@/types/entities';
import { styles } from '../styles';
import type { AttractionReviewDisplay } from '@/services/attractionReviews.service';

interface ReviewItemProps {
  review: AttractionReviewDisplay;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  getInitials: (name: string) => string;
  getTimeAgo: (date: string) => string;
}

export const ReviewItem = memo(function ReviewItem({
  review,
  isOwner,
  onEdit,
  onDelete,
  getInitials,
  getTimeAgo,
}: ReviewItemProps) {
  const colors = useThemedColors();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);
  const isLiked = useIsAttractionReviewLiked(review.id);
  const toggleLike = useToggleAttractionReviewLike();

  // Verificar si el usuario es admin
  const [userProfile, setUserProfile] = React.useState<any>(null);
  React.useEffect(() => {
    if (currentUser?.id) {
      import('@/lib/supabase/client').then(({ supabase }) => {
        supabase
          .from('profiles')
          .select('*')
          .eq('id_prf', currentUser.id)
          .single()
          .then(({ data }) => setUserProfile(data));
      });
    }
  }, [currentUser?.id]);
  const userIsAdmin = isAdmin(userProfile);
  const canEditOrDelete = isOwner || userIsAdmin;

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
    toggleLike.mutate(review.id);
  }, [review.id, isAuthenticated, toggleLike]);

  const likeColor = isLiked ? '#1877f2' : colors.text.tertiary;

  return (
    <View style={[styles.reviewItem, { backgroundColor: colors.background.secondary }]}>
      <View style={styles.reviewHeader}>
        <View style={[styles.reviewAvatar, { backgroundColor: colors.primary[100] }]}>
          <Text style={[styles.reviewAvatarText, { color: colors.primary[700] }]}>
            {getInitials(review.authorName)}
          </Text>
        </View>
        <View style={styles.reviewInfo}>
          <Text style={[styles.reviewAuthor, { color: colors.text.primary }]}>
            {review.authorName}
            {isOwner && <Text style={{ color: colors.primary[500] }}> (Tú)</Text>}
          </Text>
          <View style={styles.reviewMeta}>
            <View style={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  color="#fbbf24"
                  fill={star <= review.rating ? '#fbbf24' : 'transparent'}
                />
              ))}
            </View>
            <Text style={[styles.reviewDate, { color: colors.text.tertiary }]}>
              {getTimeAgo(review.createdAt)}
            </Text>
          </View>
        </View>
        {canEditOrDelete && <ReviewActions onEdit={onEdit} onDelete={onDelete} />}
      </View>
      {review.comment && (
        <Text style={[styles.reviewComment, { color: colors.text.secondary }]}>
          {review.comment}
        </Text>
      )}

      {/* Like Button */}
      {!canEditOrDelete && (
        <Pressable
          style={styles.reviewLikeButton}
          onPress={handleLikePress}
          disabled={toggleLike.isPending}
        >
          <ThumbsUp size={16} color={likeColor} fill={isLiked ? '#1877f2' : 'transparent'} />
          <Text style={[styles.reviewLikeText, { color: likeColor }]}>
            Me gusta{review.likesCount > 0 ? ` (${review.likesCount})` : ''}
          </Text>
        </Pressable>
      )}
    </View>
  );
});

function ReviewActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const colors = useThemedColors();

  return (
    <View style={styles.reviewActions}>
      <Pressable style={styles.reviewActionButton} onPress={onEdit}>
        <Edit3 size={16} color={colors.primary[500]} />
      </Pressable>
      <Pressable style={styles.reviewActionButton} onPress={onDelete}>
        <Trash2 size={16} color="#dc2626" />
      </Pressable>
    </View>
  );
}
