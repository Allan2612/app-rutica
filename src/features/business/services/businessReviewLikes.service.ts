import { createReviewLikesApi } from '@/services/reviews/createReviewLikesApi';

const api = createReviewLikesApi('business_review_likes', 'brl');

export const getUserLikedReviewIds = api.getUserLikedIds;
export const isReviewLikedByUser = api.isLikedByUser;
export const addReviewLike = api.add;
export const removeReviewLike = api.remove;
export const toggleReviewLike = api.toggle;
export const getReviewLikesCount = api.count;
