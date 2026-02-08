import { UserRole, SubscriptionType, SubscriptionStatus } from '@/types/enums';

// ============================================
// Profile - Tabla: profiles (prf)
// ============================================

/**
 * Perfil de usuario - Row type
 */
export interface Profile {
  id_prf: string;
  first_name_prf: string | null;
  last_name1_prf: string | null;
  last_name2_prf: string | null;
  phone_number_prf: string | null;
  role_prf: UserRole | null;
  is_active_prf: boolean;
  profile_photo_path_prf: string | null;
  created_at_prf: string;
  updated_at_prf: string;
}

/**
 * Catálogo de Suscripciones - Tabla: subscription (sub)
 */
export interface Subscription {
  id_sub: string;
  type_sub: SubscriptionType;
  name_sub: string;
  description_sub: string;
  price_sub: number;
  features_sub: string[];
  is_recurring_sub: boolean;
  is_active_sub: boolean;
  display_order_sub: number;
  created_at_sub: string;
  updated_at_sub: string;
}

/**
 * Suscripción Premium Individual - Tabla: profile_subscriptions (psub)
 * Cada registro representa una compra individual que necesita aprobación
 */
export interface ProfileSubscription {
  id_psub: string;
  profile_id_psub: string;
  subscription_id_psub: string;
  payment_reference_psub: string;
  payment_note_psub: string | null;
  status_psub: SubscriptionStatus;
  subscribed_at_psub: string;
  approved_at_psub: string | null;
  approved_by_psub: string | null;
  rejected_at_psub: string | null;
  rejected_by_psub: string | null;
  rejection_reason_psub: string | null;
  cancelled_at_psub: string | null;
  expires_at_psub: string | null; // Fecha de expiración para suscripciones mensuales
  created_at_psub: string;
  updated_at_psub: string;
  // Relación con subscription (cuando se hace JOIN)
  subscription?: {
    type_sub: SubscriptionType;
  };
}

/**
 * Datos para crear/insertar una suscripción premium
 */
export interface ProfileSubscriptionInsert {
  profile_id_psub: string;
  subscription_id_psub: string;
  payment_reference_psub: string;
  payment_note_psub?: string | null;
}

/**
 * @deprecated Use ProfileSubscription instead
 * Profile Premium - Tabla: profile_premium (ppm) - Legacy
 */
export interface ProfilePremium {
  profile_id_ppm: string;
  subscription_types_ppm: SubscriptionType[];
  subscribed_at_ppm: string;
  payment_reference_ppm: string | null;
  payment_note_ppm: string | null;
  created_at_ppm: string;
  updated_at_ppm: string;
}

/**
 * @deprecated Use ProfileSubscriptionInsert instead
 */
export interface ProfilePremiumInsert {
  profile_id_ppm: string;
  subscription_types_ppm: SubscriptionType[];
  payment_reference_ppm?: string | null;
  payment_note_ppm?: string | null;
}

/**
 * Profile con relación premium (legacy)
 */
export interface ProfileWithPremium extends Profile {
  premium?: ProfilePremium | null;
}

/**
 * Profile con suscripciones activas
 */
export interface ProfileWithSubscriptions extends Profile {
  subscriptions?: ProfileSubscription[];
}

// ============================================
// Insert/Update Types
// ============================================

export interface ProfileInsert {
  id_prf: string; // Debe coincidir con auth.uid()
  first_name_prf?: string | null;
  last_name1_prf?: string | null;
  last_name2_prf?: string | null;
  phone_number_prf?: string | null;
  role_prf?: UserRole; // Default: 'user' en BD
  is_active_prf?: boolean;
  profile_photo_path_prf?: string | null;
}

export interface ProfileUpdate {
  first_name_prf?: string | null;
  last_name1_prf?: string | null;
  last_name2_prf?: string | null;
  phone_number_prf?: string | null;
  profile_photo_path_prf?: string | null;
  // role_prf y is_active_prf NO se pueden cambiar por el usuario (solo admin)
}

// ============================================
// Helpers
// ============================================

/**
 * Obtiene el nombre completo formateado
 */
export function getFullName(profile: Profile | null | undefined): string {
  if (!profile) return '';
  const parts = [
    profile.first_name_prf,
    profile.last_name1_prf,
    profile.last_name2_prf,
  ].filter(Boolean);
  return parts.join(' ');
}

/**
 * Obtiene las iniciales del usuario
 */
export function getInitials(profile: Profile | null | undefined): string {
  if (!profile) return '?';
  const first = profile.first_name_prf?.[0] ?? '';
  const last = profile.last_name1_prf?.[0] ?? '';
  return (first + last).toUpperCase() || '?';
}

/**
 * Verifica si el usuario tiene rol de vendedor o superior
 */
export function canSell(profile: Profile | null | undefined): boolean {
  if (!profile?.role_prf) return false;
  return ['seller', 'admin'].includes(profile.role_prf);
}

/**
 * Verifica si el usuario es admin
 */
export function isAdmin(profile: Profile | null | undefined): boolean {
  return profile?.role_prf === 'admin';
}

/**
 * Verifica si el usuario es premium
 */
export function isPremium(profile: Profile | null | undefined): boolean {
  return profile?.role_prf === 'premium';
}

/**
 * Información de cada tipo de suscripción
 */
export interface SubscriptionPlanInfo {
  type: SubscriptionType;
  name: string;
  description: string;
  features: string[];
  price: string;
  priceValue: number;
  isMonthly?: boolean; // true para mensualidades, false/undefined para paquetes
}

/**
 * Planes de suscripción disponibles
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlanInfo[] = [
  {
    type: 'promotions',
    name: 'Promociones',
    description: 'Hasta 10 promociones activas',
    features: [
      'Hasta 10 promociones simultáneas',
      'Destacar en sección de promociones',
      'Mayor visibilidad para tus ofertas',
    ],
    price: '₡2,500',
    priceValue: 2500,
  },
  {
    type: 'dashboard',
    name: 'Dashboard de Negocio',
    description: 'Estadísticas completas de tu negocio',
    features: [
      'Dashboard con métricas en tiempo real',
      'Estadísticas de favoritos',
      'Clicks en contacto y redes sociales',
      'Interacciones con productos',
    ],
    price: '₡3,500/mes',
    priceValue: 3500,
    isMonthly: true,
  },
  {
    type: 'gallery_business',
    name: 'Galería Empresa',
    description: 'Hasta 10 fotos para tu negocio',
    features: [
      'Hasta 10 fotos en galería',
      'Fotos en alta resolución',
      'Galería destacada',
    ],
    price: '₡1,500',
    priceValue: 1500,
  },
  {
    type: 'package_products',
    name: 'Paquete Productos',
    description: 'Publica hasta 20 productos por negocio',
    features: [
      'Hasta 20 productos por negocio',
      '2 fotos por producto',
      'Catálogo completo',
    ],
    price: '₡5,000',
    priceValue: 5000,
  },
  {
    type: 'gallery_attractions',
    name: 'Galería Atracciones',
    description: 'Hasta 10 fotos para tus atracciones',
    features: [
      'Hasta 10 fotos por atracción',
      'Mayor visibilidad',
      'Destaca en búsquedas',
    ],
    price: '₡2,000',
    priceValue: 2000,
  },
  {
    type: 'gallery_events',
    name: 'Galería Eventos',
    description: 'Hasta 10 fotos para tus eventos',
    features: [
      'Hasta 10 fotos por evento',
      'Mayor visibilidad',
      'Destaca en búsquedas',
    ],
    price: '₡2,000',
    priceValue: 2000,
  },
  {
    type: 'full_premium',
    name: 'Premium Completo',
    description: 'Todas las herramientas para hacer crecer tu negocio',
    features: [
      'Dashboard con estadísticas completas',
      'Hasta 10 promociones simultáneas',
      'Galería extendida para empresas (10 fotos)',
      'Hasta 20 productos con 2 fotos cada uno',
      'Soporte prioritario',
    ],
    price: '₡10,000/mes',
    priceValue: 10000,
    isMonthly: true,
  },
];

/**
 * Obtiene la información de un plan por su tipo
 */
export function getSubscriptionPlanInfo(type: SubscriptionType): SubscriptionPlanInfo | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.type === type);
}

/**
 * Obtiene el nombre legible de un tipo de suscripción
 */
export function getSubscriptionTypeName(type: SubscriptionType): string {
  const plan = getSubscriptionPlanInfo(type);
  return plan?.name ?? type;
}

