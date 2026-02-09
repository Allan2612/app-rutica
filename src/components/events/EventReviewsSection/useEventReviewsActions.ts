import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store';
import {
    useEventReviews,
    useUserEventReview,
    useCreateEventReview,
    useUpdateEventReview,
    useDeleteEventReview,
} from '@/features/events/hooks/useEventReviews';

export function useEventReviewsActions(eventId: string, ownerId: string, onCloseModal: () => void) {
    const { user } = useAuthStore();

    const { data: reviews, isLoading: isLoadingReviews } = useEventReviews(eventId);
    const { data: userReview } = useUserEventReview(eventId, user?.id ?? null);

    const createReview = useCreateEventReview();
    const updateReview = useUpdateEventReview();
    const deleteReview = useDeleteEventReview();

    const isOwner = !!user && !!ownerId && user.id === ownerId;
    const canWriteReview = !!user && !userReview && !isOwner;
    const hasReviews = reviews && reviews.length > 0;
    const isSubmitting = createReview.isPending || updateReview.isPending;
    const isDeleting = deleteReview.isPending;

    const handleSubmitReview = useCallback(async (rating: number, comment: string) => {
        if (!user) return;

        try {
            if (userReview) {
                await updateReview.mutateAsync({
                    reviewId: userReview.id,
                    rating,
                    comment,
                    eventId,
                    userId: user.id,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Reseña actualizada',
                    text2: 'Tu reseña ha sido actualizada correctamente',
                    position: 'top',
                });
            } else {
                await createReview.mutateAsync({
                    eventId,
                    userId: user.id,
                    rating,
                    comment,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Reseña publicada',
                    text2: 'Gracias por compartir tu experiencia',
                    position: 'top',
                });
            }
            onCloseModal();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'No se pudo guardar la reseña',
                position: 'top',
            });
        }
    }, [user, userReview, eventId, createReview, updateReview, onCloseModal]);

    const handleDeleteReview = useCallback(async (onSuccess: () => void) => {
        if (!user || !userReview) return;

        try {
            await deleteReview.mutateAsync({
                reviewId: userReview.id,
                eventId,
                userId: user.id,
            });
            Toast.show({
                type: 'success',
                text1: 'Reseña eliminada',
                text2: 'Tu reseña ha sido eliminada',
                position: 'top',
            });
            onSuccess();
            onCloseModal();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'No se pudo eliminar la reseña',
                position: 'top',
            });
        }
    }, [user, userReview, eventId, deleteReview, onCloseModal]);

    return {
        user,
        reviews: reviews ?? [],
        userReview,
        isLoadingReviews,
        canWriteReview,
        hasReviews,
        isSubmitting,
        isDeleting,
        handleSubmitReview,
        handleDeleteReview,
    };
}
