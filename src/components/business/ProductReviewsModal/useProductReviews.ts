import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useProductReviewsQuery } from '@/features/products/hooks/useProductReviews';
import { useCreateProductReview, useUpdateProductReview, useDeleteProductReview } from '@/features/products/hooks/useProductReviews';

export function useProductReviews(productId: string, userId: string | null) {
    const { data: allReviews = [], isLoading } = useProductReviewsQuery(productId);
    const userReview = allReviews.find(r => r.userId === userId) || null;
    const reviews = allReviews;

    const createReview = useCreateProductReview();
    const updateReview = useUpdateProductReview();
    const deleteReview = useDeleteProductReview();

    const isSubmitting = createReview.isPending || updateReview.isPending;
    const isDeleting = deleteReview.isPending;

    const handleSubmitReview = useCallback(async (ratingValue: number, comment: string) => {
        if (!userId) return false;

        try {
            if (userReview) {
                await updateReview.mutateAsync({
                    reviewId: userReview.id,
                    rating: ratingValue,
                    comment,
                    productId,
                    userId,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Opinión actualizada',
                    text2: 'Tu opinión ha sido actualizada correctamente',
                    position: 'top',
                });
            } else {
                await createReview.mutateAsync({
                    productId,
                    userId,
                    rating: ratingValue,
                    comment,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Opinión publicada',
                    text2: 'Tu opinión ha sido publicada correctamente',
                    position: 'top',
                });
            }
            return true;
        } catch (error) {
            console.error('[useProductReviews] Error submitting review:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo guardar tu opinión. Intenta nuevamente.',
                position: 'top',
            });
            return false;
        }
    }, [userId, userReview, productId, createReview, updateReview]);

    const handleDeleteReview = useCallback(async () => {
        if (!userReview) return false;

        try {
            await deleteReview.mutateAsync({ reviewId: userReview.id, productId });
            Toast.show({
                type: 'success',
                text1: 'Opinión eliminada',
                text2: 'Tu opinión ha sido eliminada correctamente',
                position: 'top',
            });
            return true;
        } catch (error) {
            console.error('[useProductReviews] Error deleting review:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo eliminar tu opinión. Intenta nuevamente.',
                position: 'top',
            });
            return false;
        }
    }, [userReview, productId, deleteReview]);

    return {
        reviews,
        userReview,
        isLoading,
        isSubmitting,
        isDeleting,
        handleSubmitReview,
        handleDeleteReview,
    };
}
