import { memo } from 'react';
import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Star, Edit3, Trash2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import type { ProductReviewDisplay } from '@/services/productReviews.service';
import { styles } from './styles';
import { getNameInitials as getInitials, getDaysAgo as getTimeAgo } from '@/utils/formatters';

interface ProductReviewItemProps {
  review: ProductReviewDisplay;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProductReviewItem = memo(function ProductReviewItem({
  review,
  isOwner,
  onEdit,
  onDelete,
}: ProductReviewItemProps) {
  const colors = useThemedColors();
  const currentUser = useAuthStore((state) => state.user);

  // El rol ya está en authStore (antes se consultaba el perfil completo por cada reseña)
  const userIsAdmin = useAuthStore((state) => state.role === 'admin');
  const canEditOrDelete = isOwner || userIsAdmin;

  return (
    <View style={[styles.reviewItem, { backgroundColor: colors.background.secondary }]}>
      <View style={styles.reviewHeader}>
        {review.authorPhotoUrl ? (
          <Image
            source={{ uri: review.authorPhotoUrl }}
            style={styles.reviewAvatar}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.reviewAvatar, { backgroundColor: colors.primary[100] }]}>
            <Text style={[styles.reviewAvatarText, { color: colors.primary[700] }]}>
              {getInitials(review.authorName)}
            </Text>
          </View>
        )}
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
        {canEditOrDelete && (
          <View style={styles.reviewActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar"
              style={styles.reviewActionButton}
              onPress={onEdit}
            >
              <Edit3 size={16} color={colors.primary[500]} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Eliminar"
              style={styles.reviewActionButton}
              onPress={onDelete}
            >
              <Trash2 size={16} color="#dc2626" />
            </Pressable>
          </View>
        )}
      </View>
      {review.comment && (
        <Text style={[styles.reviewComment, { color: colors.text.secondary }]}>
          {review.comment}
        </Text>
      )}
    </View>
  );
});
