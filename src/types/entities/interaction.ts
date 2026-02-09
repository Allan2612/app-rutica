import { InteractionType } from '@/types/enums';
import { Profile } from './profile';
import { Business } from './business';
import { Event } from './event';
import { Attraction } from './attraction';
import { BusinessReview, EventReview, AttractionReview, ProductReview } from './review';

// ============================================
// Entity Interactions
// ============================================

/**
 * Interacción con negocio - Tabla: business_interactions (bin)
 */
export interface BusinessInteraction {
  id_bin: string;
  business_id_bin: string;
  user_id_bin: string | null; // NULL = visitante anónimo
  interaction_type_bin: InteractionType;
  ip_address_bin: string | null;
  user_agent_bin: string | null;
  created_at_bin: string;
}

export interface BusinessInteractionWithRelations extends BusinessInteraction {
  business?: Business | null;
  user?: Profile | null;
}

/**
 * Interacción con evento - Tabla: event_interactions (ein)
 */
export interface EventInteraction {
  id_ein: string;
  event_id_ein: string;
  user_id_ein: string | null;
  interaction_type_ein: InteractionType;
  ip_address_ein: string | null;
  user_agent_ein: string | null;
  created_at_ein: string;
}

export interface EventInteractionWithRelations extends EventInteraction {
  event?: Event | null;
  user?: Profile | null;
}

/**
 * Interacción con atracción - Tabla: attraction_interactions (ain)
 */
export interface AttractionInteraction {
  id_ain: string;
  attraction_id_ain: string;
  user_id_ain: string | null;
  interaction_type_ain: InteractionType;
  ip_address_ain: string | null;
  user_agent_ain: string | null;
  created_at_ain: string;
}

export interface AttractionInteractionWithRelations extends AttractionInteraction {
  attraction?: Attraction | null;
  user?: Profile | null;
}

// ============================================
// Review Interactions
// ============================================

/**
 * Interacción con review de negocio - Tabla: business_review_interactions (bri)
 */
export interface BusinessReviewInteraction {
  id_bri: string;
  review_id_bri: string;
  user_id_bri: string | null;
  interaction_type_bri: InteractionType;
  created_at_bri: string;
}

export interface BusinessReviewInteractionWithRelations extends BusinessReviewInteraction {
  review?: BusinessReview | null;
  user?: Profile | null;
}

/**
 * Interacción con review de evento - Tabla: event_review_interactions (eri)
 */
export interface EventReviewInteraction {
  id_eri: string;
  review_id_eri: string;
  user_id_eri: string | null;
  interaction_type_eri: InteractionType;
  created_at_eri: string;
}

export interface EventReviewInteractionWithRelations extends EventReviewInteraction {
  review?: EventReview | null;
  user?: Profile | null;
}

/**
 * Interacción con review de atracción - Tabla: attraction_review_interactions (ari)
 */
export interface AttractionReviewInteraction {
  id_ari: string;
  review_id_ari: string;
  user_id_ari: string | null;
  interaction_type_ari: InteractionType;
  created_at_ari: string;
}

export interface AttractionReviewInteractionWithRelations extends AttractionReviewInteraction {
  review?: AttractionReview | null;
  user?: Profile | null;
}

/**
 * Interacción con review de producto - Tabla: product_review_interactions (pri)
 */
export interface ProductReviewInteraction {
  id_pri: string;
  review_id_pri: string;
  user_id_pri: string | null;
  interaction_type_pri: InteractionType;
  created_at_pri: string;
}

export interface ProductReviewInteractionWithRelations extends ProductReviewInteraction {
  review?: ProductReview | null;
  user?: Profile | null;
}

// ============================================
// Insert Types
// ============================================

export interface BusinessInteractionInsert {
  business_id_bin: string;
  user_id_bin?: string | null;
  interaction_type_bin: InteractionType;
  ip_address_bin?: string | null;
  user_agent_bin?: string | null;
}

export interface EventInteractionInsert {
  event_id_ein: string;
  user_id_ein?: string | null;
  interaction_type_ein: InteractionType;
  ip_address_ein?: string | null;
  user_agent_ein?: string | null;
}

export interface AttractionInteractionInsert {
  attraction_id_ain: string;
  user_id_ain?: string | null;
  interaction_type_ain: InteractionType;
  ip_address_ain?: string | null;
  user_agent_ain?: string | null;
}

export interface BusinessReviewInteractionInsert {
  review_id_bri: string;
  user_id_bri?: string | null;
  interaction_type_bri: InteractionType;
}

export interface EventReviewInteractionInsert {
  review_id_eri: string;
  user_id_eri?: string | null;
  interaction_type_eri: InteractionType;
}

export interface AttractionReviewInteractionInsert {
  review_id_ari: string;
  user_id_ari?: string | null;
  interaction_type_ari: InteractionType;
}

export interface ProductReviewInteractionInsert {
  review_id_pri: string;
  user_id_pri?: string | null;
  interaction_type_pri: InteractionType;
}

// ============================================
// UI Types
// ============================================

/**
 * Estadísticas de interacciones para UI
 */
export interface InteractionStats {
  views: number;
  contactClicks: number;
  callClicks: number;
  emailClicks: number;
  websiteClicks: number;
  mapClicks: number;
  shareClicks: number;
  whatsappClicks: number;
  instagramClicks: number;
  facebookClicks: number;
  tiktokClicks: number;
  youtubeClicks: number;
  totalInteractions: number;
}

/**
 * Resumen de interacción reciente
 */
export interface InteractionSummary {
  entityId: string;
  entityType: 'business' | 'event' | 'attraction' | 'review';
  interactionType: InteractionType;
  count: number;
  lastInteraction: string;
}

// ============================================
// Helpers
// ============================================

/**
 * Verifica si un tipo de interacción es una vista
 */
export function isViewInteraction(type: InteractionType): boolean {
  return type.startsWith('view_');
}

/**
 * Verifica si un tipo de interacción es un click en red social
 */
export function isSocialInteraction(type: InteractionType): boolean {
  return [
    'whatsapp_click',
    'instagram_click',
    'facebook_click',
    'tiktok_click',
    'youtube_click',
  ].includes(type);
}

/**
 * Verifica si un tipo de interacción es un click de contacto
 */
export function isContactInteraction(type: InteractionType): boolean {
  return ['contact_click', 'call_click', 'email_click', 'website_click'].includes(type);
}

/**
 * Obtiene el label legible de un tipo de interacción
 */
export function getInteractionLabel(type: InteractionType): string {
  const labels: Record<InteractionType, string> = {
    view_business: 'Vista al negocio',
    view_event: 'Vista al evento',
    view_attraction: 'Vista a la atracción',
    view_review: 'Vista a la reseña',
    contact_click: 'Click en contacto',
    call_click: 'Click en llamar',
    email_click: 'Click en email',
    website_click: 'Click en sitio web',
    map_click: 'Click en mapa',
    share_click: 'Click en compartir',
    whatsapp_click: 'Click en WhatsApp',
    instagram_click: 'Click en Instagram',
    facebook_click: 'Click en Facebook',
    tiktok_click: 'Click en TikTok',
    youtube_click: 'Click en YouTube',
  };
  return labels[type] || type;
}
