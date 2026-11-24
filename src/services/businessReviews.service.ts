import { createReviewsApi, type ReviewDisplayBase } from './reviews/createReviewsApi';

export type BusinessReviewDisplay = ReviewDisplayBase & { businessId: string };

const api = createReviewsApi({
  table: 'business_reviews',
  sfx: 'brv',
  entityColumn: 'business_id_brv',
  profileFk: 'business_reviews_user_id_brv_fkey',
  likesTable: 'business_review_likes',
  entityKey: 'businessId',
});

export const getBusinessReviews = (businessId: string, userId?: string) => api.list(businessId, userId);
export const getUserBusinessReview = (businessId: string, userId: string) => api.getForUser(businessId, userId);
export const createBusinessReview = (businessId: string, userId: string, rating: number, comment?: string) =>
  api.create(businessId, userId, rating, comment);
export const updateBusinessReview = (reviewId: string, rating: number, comment?: string) =>
  api.update(reviewId, rating, comment);
// El promedio del negocio lo recalcula el trigger trg_recalc_rating
export const deleteBusinessReview = (reviewId: string, _businessId: string) => api.remove(reviewId);
