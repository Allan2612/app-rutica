import { createReviewsApi, type ReviewDisplayBase } from './reviews/createReviewsApi';

export type EventReviewDisplay = ReviewDisplayBase & { eventId: string };

const api = createReviewsApi({
  table: 'event_reviews',
  sfx: 'erv',
  entityColumn: 'event_id_erv',
  profileFk: 'event_reviews_user_id_erv_fkey',
  likesTable: 'event_review_likes',
  entityKey: 'eventId',
});

export const getEventReviews = (eventId: string, userId?: string, page = 0) =>
  api.list(eventId, userId, page);
export const getUserEventReview = (eventId: string, userId: string) =>
  api.getForUser(eventId, userId);
export const createEventReview = (
  eventId: string,
  userId: string,
  rating: number,
  comment?: string,
) => api.create(eventId, userId, rating, comment);
export const updateEventReview = (reviewId: string, rating: number, comment?: string) =>
  api.update(reviewId, rating, comment);
// El promedio del evento lo recalcula el trigger trg_recalc_rating
export const deleteEventReview = (reviewId: string, _eventId: string) => api.remove(reviewId);
