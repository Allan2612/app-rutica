import { createReviewLikesApi } from '@/services/reviews/createReviewLikesApi';

const api = createReviewLikesApi('event_review_likes', 'erl');

export const getUserLikedEventReviewIds = api.getUserLikedIds;
export const isEventReviewLikedByUser = api.isLikedByUser;
export const addEventReviewLike = api.add;
export const removeEventReviewLike = api.remove;
export const toggleEventReviewLike = api.toggle;
export const getEventReviewLikesCount = api.count;
