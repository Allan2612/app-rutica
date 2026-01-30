import { Profile } from './profile';
import { Business } from './business';
import { Event } from './event';
import { Attraction } from './attraction';
import { BusinessReview, EventReview, AttractionReview, ProductReview } from './review';

// ============================================
// Entity Likes
// ============================================

/**
 * Like de evento - Tabla: event_likes (elk)
 */
export interface EventLike {
  event_id_elk: string;
  user_id_elk: string;
  created_at_elk: string;
}

export interface EventLikeWithRelations extends EventLike {
  event?: Event | null;
  user?: Profile | null;
}

/**
 * Like de atracción - Tabla: attraction_likes (alk)
 */
export interface AttractionLike {
  attraction_id_alk: string;
  user_id_alk: string;
  created_at_alk: string;
}

export interface AttractionLikeWithRelations extends AttractionLike {
  attraction?: Attraction | null;
  user?: Profile | null;
}

/**
 * Like de negocio - Tabla: business_likes (blk)
 */
export interface BusinessLike {
  business_id_blk: string;
  user_id_blk: string;
  created_at_blk: string;
}

export interface BusinessLikeWithRelations extends BusinessLike {
  business?: Business | null;
  user?: Profile | null;
}

// ============================================
// Review Likes
// ============================================

/**
 * Like de review de evento - Tabla: event_review_likes (erl)
 */
export interface EventReviewLike {
  review_id_erl: string;
  user_id_erl: string;
  created_at_erl: string;
}

export interface EventReviewLikeWithRelations extends EventReviewLike {
  review?: EventReview | null;
  user?: Profile | null;
}

/**
 * Like de review de atracción - Tabla: attraction_review_likes (arl)
 */
export interface AttractionReviewLike {
  review_id_arl: string;
  user_id_arl: string;
  created_at_arl: string;
}

export interface AttractionReviewLikeWithRelations extends AttractionReviewLike {
  review?: AttractionReview | null;
  user?: Profile | null;
}

/**
 * Like de review de negocio - Tabla: business_review_likes (brl)
 */
export interface BusinessReviewLike {
  review_id_brl: string;
  user_id_brl: string;
  created_at_brl: string;
}

export interface BusinessReviewLikeWithRelations extends BusinessReviewLike {
  review?: BusinessReview | null;
  user?: Profile | null;
}

/**
 * Like de review de producto - Tabla: product_review_likes (prl)
 * NOTA: Esta tabla NO existe en el modelo actual, pero podría agregarse
 */
export interface ProductReviewLike {
  review_id_prl: string;
  user_id_prl: string;
  created_at_prl: string;
}

export interface ProductReviewLikeWithRelations extends ProductReviewLike {
  review?: ProductReview | null;
  user?: Profile | null;
}

// ============================================
// Insert Types
// ============================================

export interface EventLikeInsert {
  event_id_elk: string;
  user_id_elk: string;
}

export interface AttractionLikeInsert {
  attraction_id_alk: string;
  user_id_alk: string;
}

export interface BusinessLikeInsert {
  business_id_blk: string;
  user_id_blk: string;
}

export interface ProductReviewLikeInsert {
  review_id_prl: string;
  user_id_prl: string;
}

export interface EventReviewLikeInsert {
  review_id_erl: string;
  user_id_erl: string;
}

export interface AttractionReviewLikeInsert {
  review_id_arl: string;
  user_id_arl: string;
}

export interface BusinessReviewLikeInsert {
  review_id_brl: string;
  user_id_brl: string;
}

// ============================================
// UI Types
// ============================================

/**
 * Estado de like para UI
 */
export interface LikeState {
  isLiked: boolean;
  likesCount: number;
}

/**
 * Toggle result
 */
export interface LikeToggleResult {
  isLiked: boolean;
  newCount: number;
}
