import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAttractionReviews,
    getUserAttractionReview,
    createAttractionReview,
    updateAttractionReview,
    deleteAttractionReview,
    type AttractionReviewDisplay,
} from '@/services/attractionReviews.service';

const ATTRACTION_REVIEWS_KEY = 'attraction-reviews';
const USER_ATTRACTION_REVIEW_KEY = 'user-attraction-review';

/**
 * Hook para obtener todas las reseñas de una atracción
 */
export function useAttractionReviews(attractionId: string) {
    return useQuery<AttractionReviewDisplay[]>({
        queryKey: [ATTRACTION_REVIEWS_KEY, attractionId],
        queryFn: () => getAttractionReviews(attractionId),
        enabled: !!attractionId,
    });
}

/**
 * Hook para obtener la reseña del usuario actual para una atracción
 */
export function useUserAttractionReview(attractionId: string, userId: string | null) {
    return useQuery<AttractionReviewDisplay | null>({
        queryKey: [USER_ATTRACTION_REVIEW_KEY, attractionId, userId],
        queryFn: () => getUserAttractionReview(attractionId, userId!),
        enabled: !!attractionId && !!userId,
    });
}

/**
 * Hook para crear una reseña
 */
export function useCreateAttractionReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            attractionId,
            userId,
            rating,
            comment,
        }: {
            attractionId: string;
            userId: string;
            rating: number;
            comment?: string;
        }) => {
            return createAttractionReview(attractionId, userId, rating, comment);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ATTRACTION_REVIEWS_KEY, variables.attractionId],
            });
            queryClient.invalidateQueries({
                queryKey: [USER_ATTRACTION_REVIEW_KEY, variables.attractionId, variables.userId],
            });
        },
    });
}

/**
 * Hook para actualizar una reseña
 */
export function useUpdateAttractionReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reviewId,
            rating,
            comment,
            attractionId,
            userId,
        }: {
            reviewId: string;
            rating: number;
            comment?: string;
            attractionId: string;
            userId: string;
        }) => {
            return updateAttractionReview(reviewId, rating, comment);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ATTRACTION_REVIEWS_KEY, variables.attractionId],
            });
            queryClient.invalidateQueries({
                queryKey: [USER_ATTRACTION_REVIEW_KEY, variables.attractionId, variables.userId],
            });
        },
    });
}

/**
 * Hook para eliminar una reseña
 */
export function useDeleteAttractionReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reviewId,
            attractionId,
            userId,
        }: {
            reviewId: string;
            attractionId: string;
            userId: string;
        }) => {
            return deleteAttractionReview(reviewId, attractionId);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ATTRACTION_REVIEWS_KEY, variables.attractionId],
            });
            queryClient.invalidateQueries({
                queryKey: [USER_ATTRACTION_REVIEW_KEY, variables.attractionId, variables.userId],
            });
        },
    });
}
