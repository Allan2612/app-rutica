import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBusinessReviews,
  getUserBusinessReview,
  createBusinessReview,
  updateBusinessReview,
  deleteBusinessReview,
  type BusinessReviewDisplay,
} from '@/services/businessReviews.service';
import { useAuthStore } from '@/store';

/**
 * Hook para obtener todas las reseñas de un negocio
 */
export function useBusinessReviews(businessId: string) {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: ['business-reviews', businessId, userId],
    queryFn: () => getBusinessReviews(businessId, userId),
    enabled: !!businessId,
  });
}

/**
 * Hook para obtener la reseña del usuario actual para un negocio
 */
export function useUserBusinessReview(businessId: string, userId: string | null) {
  return useQuery({
    queryKey: ['user-business-review', businessId, userId],
    queryFn: () => getUserBusinessReview(businessId, userId!),
    enabled: !!businessId && !!userId,
  });
}

/**
 * Hook para crear una reseña
 */
export function useCreateBusinessReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      userId,
      rating,
      comment,
    }: {
      businessId: string;
      userId: string;
      rating: number;
      comment?: string;
    }) => createBusinessReview(businessId, userId, rating, comment),
    onSuccess: (data, variables) => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['business-reviews', variables.businessId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-business-review', variables.businessId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['business-detail', variables.businessId],
      });
    },
  });
}

/**
 * Hook para actualizar una reseña
 */
export function useUpdateBusinessReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      rating,
      comment,
      businessId,
      userId,
    }: {
      reviewId: string;
      rating: number;
      comment?: string;
      businessId: string;
      userId: string;
    }) => updateBusinessReview(reviewId, rating, comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['business-reviews', variables.businessId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-business-review', variables.businessId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['business-detail', variables.businessId],
      });
    },
  });
}

/**
 * Hook para eliminar una reseña
 */
export function useDeleteBusinessReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      businessId,
    }: {
      reviewId: string;
      businessId: string;
      userId: string;
    }) => deleteBusinessReview(reviewId, businessId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['business-reviews', variables.businessId],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-business-review', variables.businessId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['business-detail', variables.businessId],
      });
    },
  });
}
