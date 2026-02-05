import { supabase } from '@/lib/supabase/client';
import type { SubscriptionType, SubscriptionStatus } from '@/types/enums';

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

      return {
        id: item.id_psub,
        subscriptionType: sub.type_sub,
        subscriptionName: sub.name_sub,
        subscriptionDescription: sub.description_sub,
        features: sub.features_sub || [],
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
