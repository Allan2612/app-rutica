import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import {
    useAttractionReviews,
    useUserAttractionReview,
    useCreateAttractionReview,
    useUpdateAttractionReview,
    useDeleteAttractionReview,
} from '@/features/attractions/hooks/useAttractionReviews';

export function useAttractionPostReviews(attractionId: string, userId: string | null) {
    const { data: reviews } = useAttractionReviews(attractionId);
    const { data: userReview } = useUserAttractionReview(attractionId, userId);

    const createReview = useCreateAttractionReview();
    const updateReview = useUpdateAttractionReview();
    const deleteReview = useDeleteAttractionReview();

    const isSubmitting = createReview.isPending || updateReview.isPending;
    const isDeleting = deleteReview.isPending;
    const hasReviews = reviews && reviews.length > 0;

    const handleSubmitReview = useCallback(async (ratingValue: number, comment: string) => {
        if (!userId) return;

        try {
            if (userReview) {
                await updateReview.mutateAsync({
                    reviewId: userReview.id,
                    rating: ratingValue,
                    comment,
                    attractionId,
                    userId,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Reseña actualizada',
                    text2: 'Tu reseña ha sido actualizada correctamente',
                    position: 'top',
                });
            } else {
                await createReview.mutateAsync({
                    attractionId,
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
    }, [userId, userReview, attractionId, createReview, updateReview]);

    const handleDeleteReview = useCallback(async () => {
        if (!userId || !userReview) return false;

        try {
            await deleteReview.mutateAsync({
                reviewId: userReview.id,
                attractionId,
                userId,
            });
            Toast.show({
                type: 'success',
                text1: 'Reseña eliminada',
                text2: 'Tu reseña ha sido eliminada',
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
    }, [userId, userReview, attractionId, deleteReview]);

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
