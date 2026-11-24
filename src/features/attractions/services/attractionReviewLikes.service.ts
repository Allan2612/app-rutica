import { createReviewLikesApi } from '@/services/reviews/createReviewLikesApi';

const api = createReviewLikesApi('attraction_review_likes', 'arl');

export const getUserLikedAttractionReviewIds = api.getUserLikedIds;
export const isAttractionReviewLikedByUser = api.isLikedByUser;
export const addAttractionReviewLike = api.add;
export const removeAttractionReviewLike = api.remove;
export const toggleAttractionReviewLike = api.toggle;
export const getAttractionReviewLikesCount = api.count;
