import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store';
import {
    useBusinessReviews,
    useUserBusinessReview,
    useCreateBusinessReview,
    useUpdateBusinessReview,
    useDeleteBusinessReview,
} from '@/features/business/hooks/useBusinessReviews';

export function useReviewsActions(businessId: string, onCloseModal: () => void) {
    const { user, role } = useAuthStore();

    const { data: reviews, isLoading: isLoadingReviews } = useBusinessReviews(businessId);
    const { data: userReview } = useUserBusinessReview(businessId, user?.id ?? null);

    const createReview = useCreateBusinessReview();
    const updateReview = useUpdateBusinessReview();
    const deleteReview = useDeleteBusinessReview();

    const isBuyer = role === 'buyer';
    const canWriteReview = !!user && isBuyer && !userReview;
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
                    businessId,
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
                    businessId,
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
    }, [user, userReview, businessId, createReview, updateReview, onCloseModal]);

    const handleDeleteReview = useCallback(async (onSuccess: () => void) => {
        if (!user || !userReview) return;

        try {
            await deleteReview.mutateAsync({
                reviewId: userReview.id,
                businessId,
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
    }, [user, userReview, businessId, deleteReview, onCloseModal]);

    return {
        user,
        reviews: reviews ?? [],
        userReview: userReview ?? null,
        isLoadingReviews,
        canWriteReview,
        hasReviews,
        isSubmitting,
        isDeleting,
        handleSubmitReview,
        handleDeleteReview,
    };
}
