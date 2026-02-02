import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAllReviewsForAdmin,
    deleteReviewAsAdmin,
    updateReviewAsAdmin,
    getReviewsStats,
} from '@/services/adminReviews.service';
import type { ReviewFilters, ReviewType } from '@/features/admin/types';

/**
 * Hook para obtener todas las reseñas para administración
 */
export function useAdminReviews(filters?: ReviewFilters) {
    return useQuery({
        queryKey: ['admin', 'reviews', filters],
        queryFn: () => getAllReviewsForAdmin(filters),
        staleTime: 30_000, // 30 segundos
    });
}

/**
 * Hook para obtener estadísticas de reseñas
 */
export function useReviewsStats() {
    return useQuery({
        queryKey: ['admin', 'reviews', 'stats'],
        queryFn: getReviewsStats,
        staleTime: 60_000, // 1 minuto
    });
}

/**
 * Hook para eliminar una reseña como administrador
 */
export function useDeleteReviewAsAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, type, contentId }: { reviewId: string; type: ReviewType; contentId: string }) =>
            deleteReviewAsAdmin(reviewId, type, contentId),
        onSuccess: () => {
            // Invalidar todas las queries relacionadas con reseñas
            queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
            queryClient.invalidateQueries({ queryKey: ['attractions'] });
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

/**
 * Hook para actualizar una reseña como administrador
 */
export function useUpdateReviewAsAdmin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, type, contentId, rating, comment }: { 
            reviewId: string; 
            type: ReviewType; 
            contentId: string;
            rating: number;
            comment: string;
        }) => updateReviewAsAdmin(reviewId, type, contentId, rating, comment),
        onSuccess: () => {
            // Invalidar todas las queries relacionadas con reseñas
            queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
            queryClient.invalidateQueries({ queryKey: ['attractions'] });
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
