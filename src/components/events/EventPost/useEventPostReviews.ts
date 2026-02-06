import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import {
    useEventReviews,
    useUserEventReview,
    useCreateEventReview,
    useUpdateEventReview,
    useDeleteEventReview,
} from '@/features/events/hooks/useEventReviews';

export function useEventPostReviews(
    eventId: string,
    userId: string | null,
    selectedReviewId: string | null,
    selectedReviewUserId: string | null
) {
    const { data: reviews = [] } = useEventReviews(eventId);
    const { data: userReview } = useUserEventReview(eventId, userId);

    const createReview = useCreateEventReview();
    const updateReview = useUpdateEventReview();
    const deleteReview = useDeleteEventReview();

    const isSubmitting = createReview.isPending || updateReview.isPending;
    const isDeleting = deleteReview.isPending;
    const hasReviews = reviews && reviews.length > 0;

    const handleSubmitReview = useCallback(async (ratingValue: number, comment: string) => {
        if (!userId) return false;

        // Determinar si es edición basado en selectedReviewId
        const isEditing = !!selectedReviewId;
        const targetUserId = selectedReviewUserId || userId;
        const targetReviewId = selectedReviewId || userReview?.id;

        try {
            if (isEditing && targetReviewId) {
                await updateReview.mutateAsync({
                    reviewId: targetReviewId,
                    rating: ratingValue,
                    comment,
                    eventId,
                    userId: targetUserId,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Reseña actualizada',
                    text2: 'La reseña ha sido actualizada correctamente',
                    position: 'top',
                });
            } else {
                await createReview.mutateAsync({
                    eventId,
                    userId,
                    rating: ratingValue,
                    comment,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Reseña publicada',
                    text2: 'Gracias por compartir tu experiencia',
                    position: 'top',
                });
            }
            return true;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'No se pudo guardar la reseña',
                position: 'top',
            });
            return false;
        }
    }, [userId, selectedReviewId, selectedReviewUserId, userReview, eventId, createReview, updateReview]);

    const handleDeleteReview = useCallback(async () => {
        // Usar selectedReviewId si está disponible, sino userReview
        const targetReviewId = selectedReviewId || userReview?.id;
        const targetUserId = selectedReviewUserId || userId;

        if (!targetUserId || !targetReviewId) return false;

        try {
            await deleteReview.mutateAsync({
                reviewId: targetReviewId,
                eventId,
                userId: targetUserId,
            });
            Toast.show({
                type: 'success',
                text1: 'Reseña eliminada',
                text2: 'La reseña ha sido eliminada',
                position: 'top',
            });
            return true;
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'No se pudo eliminar la reseña',
                position: 'top',
            });
            return false;
        }
    }, [selectedReviewId, selectedReviewUserId, userId, userReview, eventId, deleteReview]);

    return {
        reviews: reviews ?? [],
        userReview,
        hasReviews,
        isSubmitting,
        isDeleting,
        handleSubmitReview,
        handleDeleteReview,
    };
}
