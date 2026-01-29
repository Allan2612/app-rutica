// ============================================
// ENUMS - Alineados con BD V3
// ============================================

/**
 * Rol del usuario en el sistema
 * DB: public.user_role
 * - buyer: usuario comprador básico
 * - user: usuario estándar (alias legacy)
 * - seller: vendedor con negocios
 * - admin: administrador
 * - premium: usuario con suscripción premium
 */
export type UserRole = 'buyer' | 'user' | 'seller' | 'admin' | 'premium';

/**
 * Estado de moderación para negocios, eventos, atracciones, promociones
 * DB: public.moderation_status
 */
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

/**
 * Alcance de una promoción
 * DB: public.promotion_scope
 */
export type PromotionScope = 'all' | 'products' | 'categories' | 'combo';

/**
 * Tipo de descuento
 * DB: public.discount_type
 */
export type DiscountType = 'percentage' | 'fixed';

/**
 * Estado de pago de una promoción
 * DB: public.payment_state
 */
export type PaymentState = 'pending' | 'paid' | 'rejected';

/**
 * Tipo de interacción para analytics
 * DB: public.interaction_type
 */
export type InteractionType =
  // Views
  | 'view_business'
  | 'view_event'
  | 'view_attraction'
  | 'view_review'
  // CTA / Contact
  | 'contact_click'
  | 'call_click'
  | 'email_click'
  | 'website_click'
  | 'map_click'
  | 'share_click'
  // Social channels
  | 'whatsapp_click'
  | 'instagram_click'
  | 'facebook_click'
  | 'tiktok_click'
  | 'youtube_click';

/**
 * Prefijos de imagen válidos por entidad
 * (No es enum de BD, pero se usa para validación)
 */
export type AttractionImagePrefix = 'cover' | 'gallery';
export type BusinessImagePrefix = 'logo' | 'cover' | 'gallery';
export type EventImagePrefix = 'cover' | 'gallery';
export type ProductImagePrefix = 'main' | 'secondary';
export type PromotionImagePrefix = 'flyer';
