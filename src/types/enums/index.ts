// Rol del usuario en el sistema
export type UserRole = 'buyer' | 'seller' | 'admin';

// Estado de moderación para negocios, atracciones, promociones
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

// Alcance de una promoción
export type PromoScope = 'general' | 'product' | 'category' | 'combo';

// Tipo de descuento
export type DiscountType = 'none' | 'percentage' | 'fixed';

// Tipo de posicionamiento/promoción destacada
export type PlacementType = 'none' | 'search_boost' | 'featured';

// Estado de pago de una promoción
export type PromoPaymentState = 'unpaid' | 'paid' | 'rejected';

// Tipo de evento
export type EventType = 'festival' | 'market' | 'concert' | 'workshop' | 'tour' | 'other';
