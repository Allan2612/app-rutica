import { SubscriptionType, SubscriptionStatus, ResourceType } from '@/types/enums';

// ============================================
// Subscription Usage - Tabla: subscription_usage (sus)
// ============================================

/**
 * Consumo de suscripción - Row type completo
 */
export interface SubscriptionUsage {
  id_sus: string;
  profile_subscription_id_sus: string;
  profile_id_sus: string;
  resource_type_sus: ResourceType;
  business_id_sus: string | null;
  attraction_id_sus: string | null;
  event_id_sus: string | null;
  max_quota_sus: number;
  used_count_sus: number;
  created_at_sus: string;
  updated_at_sus: string;
}

/**
 * Datos para crear un registro de uso
 */
export interface SubscriptionUsageInsert {
  profile_subscription_id_sus: string;
  profile_id_sus: string;
  resource_type_sus: ResourceType;
  business_id_sus?: string | null;
  attraction_id_sus?: string | null;
  event_id_sus?: string | null;
  max_quota_sus: number;
  used_count_sus?: number;
}

/**
 * Datos para actualizar un registro de uso
 */
export interface SubscriptionUsageUpdate {
  used_count_sus?: number;
}

// ============================================
// Tipos para verificación de cuotas
// ============================================

/**
 * Resultado de verificar cuota disponible
 */
export interface QuotaInfo {
  /** Cuota base gratuita */
  freeQuota: number;
  /** Cuota extra de suscripciones */
  premiumQuota: number;
  /** Cuota total (free + premium) */
  totalQuota: number;
  /** Cantidad actualmente usada */
  usedCount: number;
  /** Cantidad disponible */
  availableCount: number;
  /** Si puede añadir más recursos */
  canAdd: boolean;
  /** Si tiene suscripciones premium activas */
  hasPremium: boolean;
  /** ID de la suscripción para usar (la que tiene cuota disponible) */
  subscriptionIdToUse?: string;
}

/**
 * Límites configurables por tipo de recurso
 */
export interface ResourceLimits {
  /** Límite gratuito (sin suscripción) */
  freeLimit: number;
  /** Cuota por cada compra de suscripción */
  quotaPerPurchase: number;
}

/**
 * Límites por defecto para cada tipo de recurso
 */
export const DEFAULT_RESOURCE_LIMITS: Record<ResourceType, ResourceLimits> = {
  product: {
    freeLimit: 5, // 5 productos gratis por negocio
    quotaPerPurchase: 20, // 20 productos extra por compra de package_products
  },
  photo_business: {
    freeLimit: 3, // 3 fotos gratis en galería de negocio
    quotaPerPurchase: 10, // 10 fotos extra por compra de gallery_business
  },
  photo_attraction: {
    freeLimit: 3, // 3 fotos gratis en galería de atracción
    quotaPerPurchase: 10, // 10 fotos extra por compra de gallery_attractions
  },
  photo_event: {
    freeLimit: 3, // 3 fotos gratis en galería de evento
    quotaPerPurchase: 10, // 10 fotos extra por compra de gallery_events
  },
  promotion: {
    freeLimit: 5, // 5 promociones gratis por negocio
    quotaPerPurchase: 10, // 10 promociones por compra
  },
};

/**
 * Mapeo de tipo de recurso a tipo de suscripción requerida
 */
export const RESOURCE_TO_SUBSCRIPTION: Record<ResourceType, SubscriptionType> = {
  product: 'package_products',
  photo_business: 'gallery_business',
  photo_attraction: 'gallery_attractions',
  photo_event: 'gallery_events',
  promotion: 'promotions',
};

// ============================================
// Helpers
// ============================================

/**
 * Obtiene la cuota disponible de un QuotaInfo
 */
export function getAvailableQuota(quotaInfo: QuotaInfo): number {
  return quotaInfo.availableCount;
}

/**
 * Verifica si se puede añadir un recurso
 */
export function canAddResource(quotaInfo: QuotaInfo): boolean {
  return quotaInfo.canAdd;
}

/**
 * Obtiene mensaje descriptivo del estado de cuota
 */
export function getQuotaMessage(quotaInfo: QuotaInfo, resourceName: string): string {
  if (quotaInfo.canAdd) {
    return `${quotaInfo.usedCount}/${quotaInfo.totalQuota} ${resourceName} usados`;
  }

  if (!quotaInfo.hasPremium) {
    return `Has alcanzado el límite de ${quotaInfo.freeQuota} ${resourceName} gratuitos. ¡Adquiere un paquete para añadir más!`;
  }

  return `Has usado toda tu cuota de ${resourceName}. ¡Adquiere otro paquete para continuar!`;
}
