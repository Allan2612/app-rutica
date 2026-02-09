import { useState, useCallback, memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewModal } from '../ReviewModal';
import { ConfirmDeleteDialog } from '@/components/manage/ConfirmDeleteDialog';
import { EmptyReviewsState } from './EmptyReviewsState';
import { ReviewsList } from './ReviewsList';
import { useReviewsActions } from './useReviewsActions';
import { styles } from './styles';

interface ReviewsSectionProps {
  businessId: string;
  businessName: string;
  businessLogo?: string;
  ownerId: string;
}

export const ReviewsSection = memo(function ReviewsSection({
  businessId,
  businessName,
  businessLogo,
  ownerId,
}: ReviewsSectionProps) {
  const colors = useThemedColors();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [selectedReviewUserId, setSelectedReviewUserId] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedReviewId(null);
    setSelectedReviewUserId(null);
  }, []);

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
  } = useReviewsActions(businessId, ownerId, closeModal);

  const handleOpenModal = useCallback((reviewId: string, userId: string) => {
    setSelectedReviewId(reviewId);
    setSelectedReviewUserId(userId);
    setIsModalVisible(true);
  }, []);

  const handleOpenDeleteDialog = useCallback((reviewId: string, userId: string) => {
    setSelectedReviewId(reviewId);
    setSelectedReviewUserId(userId);
    setIsDeleteDialogVisible(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogVisible(false);
    setSelectedReviewId(null);
    setSelectedReviewUserId(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    handleDeleteReview(
      handleCloseDeleteDialog,
      selectedReviewId || undefined,
      selectedReviewUserId || undefined,
    );
  }, [handleDeleteReview, handleCloseDeleteDialog, selectedReviewId, selectedReviewUserId]);

  const handleSubmitReviewWrapper = useCallback(
    (rating: number, comment: string) => {
      return handleSubmitReview(
        rating,
        comment,
        selectedReviewId || undefined,
        selectedReviewUserId || undefined,
      );
    },
    [handleSubmitReview, selectedReviewId, selectedReviewUserId],
  );

  // Obtener la reseña seleccionada para edición
  const selectedReview = selectedReviewId
    ? reviews.find((r) => r.id === selectedReviewId) || userReview
    : userReview;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Comentarios</Text>

      {!hasReviews ? (
        <EmptyReviewsState
          canWriteReview={canWriteReview}
          isLoading={isLoadingReviews}
          onWriteReview={() => {
            setSelectedReviewId(null);
            setSelectedReviewUserId(null);
            setIsModalVisible(true);
          }}
        />
      ) : (
        <ReviewsList
          reviews={reviews}
          userReview={userReview}
          currentUserId={user?.id ?? null}
          canWriteReview={canWriteReview}
          isDeleting={isDeleting}
          onEdit={handleOpenModal}
          onDelete={handleOpenDeleteDialog}
          onWriteReview={() => {
            setSelectedReviewId(null);
            setSelectedReviewUserId(null);
            setIsModalVisible(true);
          }}
        />
      )}

      {/* Review Modal */}
      <ReviewModal
        visible={isModalVisible}
        onClose={closeModal}
        onSubmit={handleSubmitReviewWrapper}
        businessName={businessName}
        businessLogo={businessLogo}
        existingRating={selectedReview?.rating}
        existingComment={selectedReview?.comment}
        isEditMode={!!selectedReview}
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
