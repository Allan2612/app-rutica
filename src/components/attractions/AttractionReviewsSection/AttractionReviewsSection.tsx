import { useState, useCallback, memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewModal } from '@/components/business/ReviewModal';
import { ConfirmDeleteDialog } from '@/components/manage/ConfirmDeleteDialog';
import { EmptyAttractionReviewsState } from './EmptyAttractionReviewsState';
import { AttractionReviewsList } from './AttractionReviewsList';
import { useAttractionReviewsActions } from './useAttractionReviewsActions';
import { styles } from './styles';

interface AttractionReviewsSectionProps {
  attractionId: string;
  attractionName: string;
  attractionImage?: string;
  ownerId?: string | null;
}

export const AttractionReviewsSection = memo(function AttractionReviewsSection({
  attractionId,
  attractionName,
  attractionImage,
  ownerId,
}: AttractionReviewsSectionProps) {
  const colors = useThemedColors();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const closeModal = useCallback(() => setIsModalVisible(false), []);

  const {
    user,
    reviews,
    userReview,
    isLoadingReviews,
    canWriteReview,
    hasReviews,
    isSubmitting,
    isDeleting,
    handleSubmitReview,
    handleDeleteReview,
  } = useAttractionReviewsActions(attractionId, ownerId ?? '', closeModal);

  const handleOpenModal = useCallback(() => setIsModalVisible(true), []);
  const handleOpenDeleteDialog = useCallback(() => setIsDeleteDialogVisible(true), []);
  const handleCloseDeleteDialog = useCallback(() => setIsDeleteDialogVisible(false), []);

  const handleConfirmDelete = useCallback(() => {
    handleDeleteReview(handleCloseDeleteDialog);
  }, [handleDeleteReview, handleCloseDeleteDialog]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Comentarios</Text>

      {!hasReviews ? (
        <EmptyAttractionReviewsState
          canWriteReview={canWriteReview}
          isLoading={isLoadingReviews}
          onWriteReview={handleOpenModal}
        />
      ) : (
        <AttractionReviewsList
          reviews={reviews}
          userReview={userReview}
          currentUserId={user?.id ?? null}
          canWriteReview={canWriteReview}
          isDeleting={isDeleting}
          onEdit={handleOpenModal}
          onDelete={handleOpenDeleteDialog}
          onWriteReview={handleOpenModal}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        visible={isModalVisible}
        onClose={closeModal}
        onSubmit={handleSubmitReview}
        businessName={attractionName}
        businessLogo={attractionImage}
        existingRating={userReview?.rating}
        existingComment={userReview?.comment}
        isEditMode={!!userReview}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        visible={isDeleteDialogVisible}
        entityName="Mi reseña"
        entityType="reseña"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        isDeleting={isDeleting}
      />
    </View>
  );
});
