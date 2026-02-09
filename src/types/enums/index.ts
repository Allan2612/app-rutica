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

/**
 * Union type para todos los tipos de imagen
 * Usado en admin/verification para manejar imágenes de cualquier entidad
 */
export type ImageType =
  | AttractionImagePrefix
  | BusinessImagePrefix
  | EventImagePrefix
  | ProductImagePrefix
  | PromotionImagePrefix
  | 'product' // Para productos dentro de promociones combo
  | 'combo' // Para imágenes de combo
  | 'brand'; // Para branding

/**
 * Tipo de suscripción premium
 * DB: public.subscription_type
 */
export type SubscriptionType =
  | 'promotions' // Promociones ilimitadas
  | 'dashboard' // Dashboard de negocio con estadísticas
  | 'gallery_business' // Galería extendida para empresa
  | 'package_products' // Hasta 20 productos con 2 fotos cada uno
  | 'gallery_attractions' // Galería de hasta 10 fotos para atracciones
  | 'gallery_events' // Galería de hasta 10 fotos para eventos
  | 'full_premium'; // Acceso completo a todas las funcionalidades

/**
 * Estado de una suscripción premium
 * DB: public.subscription_status
 */
export type SubscriptionStatus =
  | 'pending' // Pendiente de aprobación
  | 'approved' // Aprobada por admin
  | 'rejected' // Rechazada por admin
  | 'cancelled' // Cancelada por usuario
  | 'expired'; // Expirada (para suscripciones mensuales)

/**
 * Tipo de recurso consumible por suscripción
 * DB: public.resource_type
 */
export type ResourceType =
  | 'product' // Productos de negocio
  | 'photo_business' // Fotos de galería de negocio
  | 'photo_attraction' // Fotos de galería de atracción
  | 'photo_event' // Fotos de galería de evento
  | 'promotion'; // Promociones
