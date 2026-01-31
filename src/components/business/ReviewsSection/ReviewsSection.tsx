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
    } = useReviewsActions(businessId, ownerId, closeModal);

    const handleOpenModal = useCallback(() => setIsModalVisible(true), []);
    const handleOpenDeleteDialog = useCallback(() => setIsDeleteDialogVisible(true), []);
    const handleCloseDeleteDialog = useCallback(() => setIsDeleteDialogVisible(false), []);

    const handleConfirmDelete = useCallback(() => {
        handleDeleteReview(handleCloseDeleteDialog);
    }, [handleDeleteReview, handleCloseDeleteDialog]);

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
                Comentarios
            </Text>

            {!hasReviews ? (
                <EmptyReviewsState
                    canWriteReview={canWriteReview}
                    isLoading={isLoadingReviews}
                    onWriteReview={handleOpenModal}
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
                    onWriteReview={handleOpenModal}
                />
            )}

            {/* Review Modal */}
            <ReviewModal
                visible={isModalVisible}
                onClose={closeModal}
                onSubmit={handleSubmitReview}
                businessName={businessName}
                businessLogo={businessLogo}
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
