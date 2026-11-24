import { createReviewsApi, type ReviewDisplayBase } from './reviews/createReviewsApi';

export type AttractionReviewDisplay = ReviewDisplayBase & { attractionId: string };

const api = createReviewsApi({
  table: 'attraction_reviews',
  sfx: 'arv',
  entityColumn: 'attraction_id_arv',
  profileFk: 'attraction_reviews_user_id_arv_fkey',
  likesTable: 'attraction_review_likes',
  entityKey: 'attractionId',
});

export const getAttractionReviews = (attractionId: string, userId?: string) => api.list(attractionId, userId);
export const getUserAttractionReview = (attractionId: string, userId: string) =>
  api.getForUser(attractionId, userId);
export const createAttractionReview = (
  attractionId: string,
  userId: string,
  rating: number,
  comment?: string,
) => api.create(attractionId, userId, rating, comment);
export const updateAttractionReview = (reviewId: string, rating: number, comment?: string) =>
  api.update(reviewId, rating, comment);
// El promedio de la atracción lo recalcula el trigger trg_recalc_rating
export const deleteAttractionReview = (reviewId: string, _attractionId: string) => api.remove(reviewId);
