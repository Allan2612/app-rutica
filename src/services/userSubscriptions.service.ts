import { supabase } from '@/lib/supabase/client';
import type { SubscriptionType, SubscriptionStatus } from '@/types/enums';
import { SUBSCRIPTION_PLANS } from '@/types/entities';

// ============================================
// Types
// ============================================

export interface UserActiveSubscription {
  id: string;
  subscriptionType: SubscriptionType;
  subscriptionName: string;
  subscriptionDescription: string;
  features: string[];
  approvedAt: string;
}

export interface UserSubscriptionSummary {
  hasActiveSubscriptions: boolean;
  activeCount: number;
  subscriptions: UserActiveSubscription[];
}

// Tipo para la respuesta de la query
interface SubscriptionQueryResult {
  id_psub: string;
  approved_at_psub: string | null;
  subscription: {
    type_sub: SubscriptionType;
    name_sub: string;
    description_sub: string;
    features_sub: string[];
  } | null;
}

// ============================================
// Services
// ============================================

/**
 * Obtiene las suscripciones activas (aprobadas) del usuario actual
 */
export async function getUserActiveSubscriptions(
  userId: string
): Promise<UserActiveSubscription[]> {
  // Validar que userId sea válido
  if (!userId || userId === 'undefined' || userId === 'null') {
    console.warn('[userSubscriptions] Invalid userId provided:', userId);
    return [];
  }

  const { data, error } = await supabase
    .from('profile_subscriptions')
    .select(`
      id_psub,
      approved_at_psub,
      subscription:subscription_id_psub (
        type_sub,
        name_sub,
        description_sub,
        features_sub
      )
    `)
    .eq('profile_id_psub', userId)
    .eq('status_psub', 'approved' as SubscriptionStatus)
    .order('approved_at_psub', { ascending: false });

  if (error) {
    console.error('[userSubscriptions] Error fetching subscriptions:', error);
    return [];
  }

  if (!data) return [];

  // Type assertion para el resultado
  const results = data as unknown as SubscriptionQueryResult[];

  return results
    .filter((item) => item.subscription !== null)
    .map((item) => {
      const sub = item.subscription!;

      // Usar los features del código como fuente de verdad (no de la BD)
      const planInfo = SUBSCRIPTION_PLANS.find(p => p.type === sub.type_sub);
      const features = planInfo?.features || sub.features_sub || [];

      return {
        id: item.id_psub,
        subscriptionType: sub.type_sub,
        subscriptionName: sub.name_sub,
        subscriptionDescription: sub.description_sub,
        features,
        approvedAt: item.approved_at_psub || '',
      };
    });
}

/**
 * Obtiene un resumen de las suscripciones del usuario
 */
export async function getUserSubscriptionSummary(
  userId: string
): Promise<UserSubscriptionSummary> {
  const subscriptions = await getUserActiveSubscriptions(userId);

  return {
    hasActiveSubscriptions: subscriptions.length > 0,
    activeCount: subscriptions.length,
    subscriptions,
  };
}

/**
 * Verifica si el usuario tiene una suscripción específica activa
 */
export async function hasActiveSubscription(
  userId: string,
  subscriptionType: SubscriptionType
): Promise<boolean> {
  // Validar que userId sea válido
  if (!userId || userId === 'undefined' || userId === 'null') {
    console.warn('[userSubscriptions] Invalid userId provided:', userId);
    return false;
  }

  const { count, error } = await supabase
    .from('profile_subscriptions')
    .select('id_psub', { count: 'exact', head: true })
    .eq('profile_id_psub', userId)
    .eq('status_psub', 'approved' as SubscriptionStatus)
    .eq('subscription_id_psub', subscriptionType);

  if (error) {
    console.error('[userSubscriptions] Error checking subscription:', error);
    return false;
  }

  return (count ?? 0) > 0;
}

/**
 * Verifica si el usuario tiene premium completo
 */
export async function hasFullPremium(userId: string): Promise<boolean> {
  const subscriptions = await getUserActiveSubscriptions(userId);
  return subscriptions.some((s) => s.subscriptionType === 'full_premium');
}

// ============================================
// Tipos para detalle completo de suscripciones
// ============================================

export interface SubscriptionUsageEntity {
  type: 'business' | 'attraction' | 'event';
  id: string;
  name: string;
}

export interface SubscriptionUsageDetail {
  resourceType: string;
  usedCount: number;
  maxQuota: number;
  entity: SubscriptionUsageEntity | null;
}

export interface UserSubscriptionDetail {
  id: string;
  subscriptionType: SubscriptionType;
  subscriptionName: string;
  subscriptionDescription: string;
  features: string[];
  price: number;
  status: SubscriptionStatus;
  approvedAt: string | null;
  expiresAt: string | null;
  subscribedAt: string;
  usageDetails: SubscriptionUsageDetail[];
}

// ============================================
// Servicio para obtener detalle completo
// ============================================

/**
 * Obtiene las suscripciones del usuario con detalles de consumo y entidades asociadas
 */
export async function getUserSubscriptionDetails(
  userId: string
): Promise<UserSubscriptionDetail[]> {
  // Validar que userId sea válido
  if (!userId || userId === 'undefined' || userId === 'null') {
    console.warn('[userSubscriptions] Invalid userId provided:', userId);
    return [];
  }

  // 1. Obtener suscripciones aprobadas del usuario con precio
  const { data: subscriptionsData, error: subError } = await supabase
    .from('profile_subscriptions')
    .select(`
      id_psub,
      status_psub,
      approved_at_psub,
      subscribed_at_psub,
      expires_at_psub,
      subscription:subscription_id_psub (
        type_sub,
        name_sub,
        description_sub,
        features_sub,
        price_sub
      )
    `)
    .eq('profile_id_psub', userId)
    .eq('status_psub', 'approved' as SubscriptionStatus)
    .order('approved_at_psub', { ascending: false });

  if (subError) {
    console.error('[userSubscriptions] Error fetching subscriptions:', subError);
    return [];
  }

  if (!subscriptionsData || subscriptionsData.length === 0) return [];

  const subscriptionIds = subscriptionsData.map((s: any) => s.id_psub);

  // 2. Obtener todos los registros de usage para estas suscripciones
  const { data: usageData, error: usageError } = await supabase
    .from('subscription_usage')
    .select(`
      profile_subscription_id_sus,
      resource_type_sus,
      used_count_sus,
      max_quota_sus,
      business_id_sus,
      attraction_id_sus,
      event_id_sus
    `)
    .in('profile_subscription_id_sus', subscriptionIds);

  if (usageError) {
    console.error('[userSubscriptions] Error fetching usage:', usageError);
  }

  // 3. Obtener nombres de entidades referenciadas
  const businessIds = [...new Set((usageData || []).filter((u: any) => u.business_id_sus).map((u: any) => u.business_id_sus))];
  const attractionIds = [...new Set((usageData || []).filter((u: any) => u.attraction_id_sus).map((u: any) => u.attraction_id_sus))];
  const eventIds = [...new Set((usageData || []).filter((u: any) => u.event_id_sus).map((u: any) => u.event_id_sus))];

  // Fetch nombres de negocios
  const businessNames: Record<string, string> = {};
  if (businessIds.length > 0) {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id_bus, name_bus')
      .in('id_bus', businessIds);
    (businesses || []).forEach((b: any) => {
      businessNames[b.id_bus] = b.name_bus;
    });
  }

  // Fetch nombres de atracciones
  const attractionNames: Record<string, string> = {};
  if (attractionIds.length > 0) {
    const { data: attractions } = await supabase
      .from('attractions')
      .select('id_atr, name_atr')
      .in('id_atr', attractionIds);
    (attractions || []).forEach((a: any) => {
      attractionNames[a.id_atr] = a.name_atr;
    });
  }

  // Fetch nombres de eventos
  const eventNames: Record<string, string> = {};
  if (eventIds.length > 0) {
    const { data: events } = await supabase
      .from('events')
      .select('id_evt, name_evt')
      .in('id_evt', eventIds);
    (events || []).forEach((e: any) => {
      eventNames[e.id_evt] = e.name_evt;
    });
  }

  // 4. Mapear resultados
  const usageBySubscription = new Map<string, SubscriptionUsageDetail[]>();
  (usageData || []).forEach((usage: any) => {
    const subscriptionId = usage.profile_subscription_id_sus;
    if (!usageBySubscription.has(subscriptionId)) {
      usageBySubscription.set(subscriptionId, []);
    }

    let entity: SubscriptionUsageEntity | null = null;
    if (usage.business_id_sus) {
      entity = {
        type: 'business',
        id: usage.business_id_sus,
        name: businessNames[usage.business_id_sus] || 'Negocio',
      };
    } else if (usage.attraction_id_sus) {
      entity = {
        type: 'attraction',
        id: usage.attraction_id_sus,
        name: attractionNames[usage.attraction_id_sus] || 'Atracción',
      };
    } else if (usage.event_id_sus) {
      entity = {
        type: 'event',
        id: usage.event_id_sus,
        name: eventNames[usage.event_id_sus] || 'Evento',
      };
    }

    usageBySubscription.get(subscriptionId)!.push({
      resourceType: usage.resource_type_sus,
      usedCount: usage.used_count_sus,
      maxQuota: usage.max_quota_sus,
      entity,
    });
  });

  // 5. Construir resultado final
  return subscriptionsData.map((sub: any) => {
    const subscription = sub.subscription;
    const subscriptionType = subscription?.type_sub || 'unknown';

    // Usar los features del código como fuente de verdad (no de la BD)
    const planInfo = SUBSCRIPTION_PLANS.find(p => p.type === subscriptionType);
    const features = planInfo?.features || subscription?.features_sub || [];

    return {
      id: sub.id_psub,
      subscriptionType,
      subscriptionName: subscription?.name_sub || 'Desconocido',
      subscriptionDescription: subscription?.description_sub || '',
      features,
      price: subscription?.price_sub || 0,
      status: sub.status_psub,
      approvedAt: sub.approved_at_psub,
      expiresAt: sub.expires_at_psub,
      subscribedAt: sub.subscribed_at_psub,
      usageDetails: usageBySubscription.get(sub.id_psub) || [],
    };
  });
}
