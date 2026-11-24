import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from '@/services/productReviews.service';

import { usePagedList } from '@/hooks/usePagedList';

const PRODUCT_REVIEWS_KEY = 'product-reviews';

export function useProductReviewsQuery(productId: string) {
  return usePagedList(
    [PRODUCT_REVIEWS_KEY, productId],
    (page) => getProductReviews(productId, page),
    { enabled: !!productId },
  );
}

export function useCreateProductReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      userId,
      rating,
      comment,
    }: {
      productId: string;
      userId: string;
      rating: number;
      comment?: string;
    }) => createProductReview(productId, userId, rating, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_REVIEWS_KEY, variables.productId],
      });
    },
  });
}

export function useUpdateProductReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      rating,
      comment,
      productId,
    }: {
      reviewId: string;
      rating: number;
      comment?: string;
      productId: string;
      userId: string;
    }) => updateProductReview(reviewId, rating, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_REVIEWS_KEY, variables.productId],
      });
    },
  });
}

export function useDeleteProductReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, productId }: { reviewId: string; productId: string }) =>
      deleteProductReview(reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_REVIEWS_KEY, variables.productId],
      });
    },
  });
}
