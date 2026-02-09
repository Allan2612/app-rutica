import { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star, Trash2, Tag, Edit3 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { AdminReviewDisplay, ReviewType } from '@/features/admin/types';
import { REVIEW_TYPE_LABELS } from '@/features/admin/types';
import { DeleteReviewDialog } from '../DeleteReviewDialog';
import { styles } from './styles';

interface AdminReviewCardProps {
  review: AdminReviewDisplay;
  onDelete: (reviewId: string, type: ReviewType, contentId: string) => void;
  onEdit?: (reviewId: string, type: ReviewType, contentId: string) => void;
}

export const AdminReviewCard = memo<AdminReviewCardProps>(function AdminReviewCard({
  review,
  onDelete,
  onEdit,
}) {
  const colors = useThemedColors();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeletePress = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(review.id, review.type, review.contentId);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < review.rating ? colors.rating.star : colors.rating.starBg}
        color={index < review.rating ? colors.rating.star : colors.text.tertiary}
        strokeWidth={2}
      />
    ));
  };

  const typeColor = colors.reviewTypes[review.type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.border.medium,
          opacity: isDeleting ? 0.5 : 1,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: `${typeColor}15` }]}>
            <Tag color={typeColor} size={12} strokeWidth={2} />
            <Text style={[styles.typeText, { color: typeColor }]}>
              {REVIEW_TYPE_LABELS[review.type]}
            </Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>{renderStars()}</View>
          <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
            {review.rating.toFixed(1)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {onEdit && (
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.primary[500] + '15',
                  borderColor: colors.primary[500],
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => onEdit(review.id, review.type, review.contentId)}
              disabled={isDeleting}
            >
              <Edit3 color={colors.primary[500]} size={16} strokeWidth={2} />
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: colors.error + '15',
                borderColor: colors.error,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={handleDeletePress}
            disabled={isDeleting}
          >
            <Trash2 color={colors.error} size={16} strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      {/* Content Title */}
      <Text style={[styles.contentTitle, { color: colors.text.primary }]}>
        {review.contentTitle}
      </Text>

      {/* Author and Date - Together */}
      <View style={styles.authorDateRow}>
        <Text style={[styles.authorText, { color: colors.text.secondary }]}>
          {review.authorName}
        </Text>
        <Text style={[styles.separator, { color: colors.text.tertiary }]}>•</Text>
        <Text style={[styles.dateText, { color: colors.text.tertiary }]}>
          {formatDate(review.createdAt)}
        </Text>
      </View>

      {/* Comment with background */}
      {review.comment && (
        <View style={[styles.commentContainer, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.commentText, { color: colors.text.secondary }]} numberOfLines={3}>
            {review.comment}
          </Text>
        </View>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteReviewDialog
        visible={showDeleteDialog}
        authorName={review.authorName}
        contentTitle={review.contentTitle}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </View>
  );
});
