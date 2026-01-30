import { Profile } from './profile';
import { Business } from './business';
import { Product } from './product';
import { Attraction } from './attraction';
import { Event } from './event';

// ============================================
// Business Reviews - Tabla: business_reviews (brv)
// ============================================

export interface BusinessReview {
  id_brv: string;
  business_id_brv: string | null;
  user_id_brv: string | null;
  rating_brv: number | null;
  comment_brv: string | null;
  created_at_brv: string;
}

export interface BusinessReviewWithRelations extends BusinessReview {
  user?: Profile | null;
  business?: Business | null;
}

export interface BusinessReviewInsert {
  business_id_brv: string;
  user_id_brv: string;
  rating_brv: number;
  comment_brv?: string | null;
}

// ============================================
// Event Reviews - Tabla: event_reviews (erv)
// ============================================

export interface EventReview {
  id_erv: string;
  event_id_erv: string | null;
  user_id_erv: string | null;
  rating_erv: number | null;
  comment_erv: string | null;
  created_at_erv: string;
}

export interface EventReviewWithRelations extends EventReview {
  user?: Profile | null;
  event?: Event | null;
}

export interface EventReviewInsert {
  event_id_erv: string;
  user_id_erv: string;
  rating_erv: number;
  comment_erv?: string | null;
}

// ============================================
// Attraction Reviews - Tabla: attraction_reviews (arv)
// ============================================

export interface AttractionReview {
  id_arv: string;
  attraction_id_arv: string | null;
  user_id_arv: string | null;
  rating_arv: number | null;
  comment_arv: string | null;
  created_at_arv: string;
}

export interface AttractionReviewWithRelations extends AttractionReview {
  user?: Profile | null;
  attraction?: Attraction | null;
}

export interface AttractionReviewInsert {
  attraction_id_arv: string;
  user_id_arv: string;
  rating_arv: number;
  comment_arv?: string | null;
}

// ============================================
// Product Reviews - Tabla: product_reviews (prv)
// ============================================

export interface ProductReview {
  id_prv: string;
  product_id_prv: string | null;
  user_id_prv: string | null;
  rating_prv: number | null;
  comment_prv: string | null;
  created_at_prv: string;
}

export interface ProductReviewWithRelations extends ProductReview {
  user?: Profile | null;
  product?: Product | null;
}

export interface ProductReviewInsert {
  product_id_prv: string;
  user_id_prv: string;
  rating_prv: number;
  comment_prv?: string | null;
}

// ============================================
// UI Types (Unificados para todas las reviews)
// ============================================

/**
 * Item de review para mostrar en listas
 */
export interface ReviewListItem {
  id: string;
  entityType: 'business' | 'event' | 'attraction' | 'product';
  entityId: string;
  entityName: string | null;
  userId: string;
  userName: string | null;
  userAvatarUrl: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}

/**
 * Datos para crear una review desde formulario
 */
export interface ReviewFormData {
  rating: number;
  comment: string | null;
}

// ============================================
// Helpers
// ============================================

/**
 * Formatea el rating para mostrar (ej: 4.5)
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Obtiene el texto descriptivo del rating
 */
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return 'Excelente';
  if (rating >= 4) return 'Muy bueno';
  if (rating >= 3) return 'Bueno';
  if (rating >= 2) return 'Regular';
  return 'Malo';
}

/**
 * Calcula el promedio de ratings
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}
