import { useState, useCallback, memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { ReviewModal } from '@/components/business/ReviewModal';
import { ConfirmDeleteDialog } from '@/components/manage/ConfirmDeleteDialog';
import { EmptyEventReviewsState } from './EmptyEventReviewsState';
import { EventReviewsList } from './EventReviewsListSection';
import { useEventReviewsActions } from './useEventReviewsActions';
import { styles } from './styles';

interface EventReviewsSectionProps {
    eventId: string;
    eventName: string;
    eventImage?: string;
}

export const EventReviewsSection = memo(function EventReviewsSection({
    eventId,
    eventName,
    eventImage,
}: EventReviewsSectionProps) {
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
    } = useEventReviewsActions(eventId, closeModal);

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
                <EmptyEventReviewsState
                    canWriteReview={canWriteReview}
                    isLoading={isLoadingReviews}
                    onWriteReview={handleOpenModal}
                />
            ) : (
                <EventReviewsList
                    reviews={reviews}
                    userReview={userReview ?? null}
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
                businessName={eventName}
                businessLogo={eventImage}
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
