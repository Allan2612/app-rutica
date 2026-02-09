import { supabase } from '@/lib/supabase/client';
import type { ProfileSubscription, Subscription, Profile } from '@/types/entities';
import type { SubscriptionStatus } from '@/types/enums';

// ============================================
// Types
// ============================================

export interface ProfileSubscriptionWithDetails extends ProfileSubscription {
  profile?: Pick<Profile, 'id_prf' | 'first_name_prf' | 'last_name1_prf' | 'last_name2_prf'>;
  subscription_details?: Pick<Subscription, 'id_sub' | 'name_sub' | 'type_sub' | 'price_sub'>;
}

export interface SubscriptionFilters {
  status?: SubscriptionStatus | 'all';
  search?: string;
}

export interface SubscriptionStats {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  expired: number;
  total: number;
}

// ============================================
// Profile Subscriptions (Admin)
// ============================================

/**
 * Obtiene todas las suscripciones con detalles del perfil y plan
 */
export async function getAllSubscriptionsWithDetails(
  filters?: SubscriptionFilters,
): Promise<ProfileSubscriptionWithDetails[]> {
  let query = supabase
    .from('profile_subscriptions')
    .select(
      `
            *,
            profile:profiles!profile_id_psub (
                id_prf,
                first_name_prf,
                last_name1_prf,
                last_name2_prf
            ),
            subscription_details:subscription!subscription_id_psub (
                id_sub,
                name_sub,
                type_sub,
                price_sub
            )
        `,
    )
    .order('created_at_psub', { ascending: false });

  // Apply status filter
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status_psub', filters.status);
  }

  const { data, error } = await query;

  if (error) throw error;

  let results = (data as ProfileSubscriptionWithDetails[]) || [];

  // Apply search filter (client-side for profile names)
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter((sub) => {
      const fullName = [
        sub.profile?.first_name_prf,
        sub.profile?.last_name1_prf,
        sub.profile?.last_name2_prf,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const planName = sub.subscription_details?.name_sub?.toLowerCase() || '';
      const paymentRef = sub.payment_reference_psub?.toLowerCase() || '';
      return (
        fullName.includes(searchLower) ||
        planName.includes(searchLower) ||
        paymentRef.includes(searchLower)
      );
    });
  }

  return results;
}

/**
 * Obtiene estadísticas de suscripciones
 */
export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  const { data, error } = await supabase.from('profile_subscriptions').select('status_psub');

  if (error) throw error;

  const stats: SubscriptionStats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    expired: 0,
    total: 0,
  };

  ((data || []) as { status_psub: SubscriptionStatus }[]).forEach((sub) => {
    stats.total++;
    const status = sub.status_psub;
    if (status in stats) {
      stats[status]++;
    }
  });

  return stats;
}

export interface SubscriptionApprovalResult {
  subscription: ProfileSubscription;
  profileId: string;
  userName: string;
  packageName: string;
}

/**
 * Aprueba una suscripción
 * Para suscripciones mensuales (dashboard, full_premium), calcula fecha de expiración
 */
export async function approveSubscription(
  subscriptionId: string,
): Promise<SubscriptionApprovalResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No authenticated user');

  // Primero obtener la suscripción con datos del usuario y plan
  const { data: subscription, error: fetchError } = await supabase
    .from('profile_subscriptions')
    .select(
      `
            *,
            subscription:subscription_id_psub (
                type_sub,
                name_sub
            ),
            profile:profile_id_psub (
                first_name_prf,
                last_name1_prf
            )
        `,
    )
    .eq('id_psub', subscriptionId)
    .single();

  if (fetchError) throw fetchError;
  if (!subscription) throw new Error('Suscripción no encontrada');

  const subscriptionData = subscription as any;
  const subscriptionType = subscriptionData.subscription?.type_sub;
  const packageName = subscriptionData.subscription?.name_sub || 'Paquete Premium';
  const approvalDate = new Date();
  const profileId = subscriptionData.profile_id_psub;

  // Nombre del usuario
  const firstName = subscriptionData.profile?.first_name_prf || '';
  const lastName = subscriptionData.profile?.last_name1_prf || '';
  const userName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

  // Calcular fecha de expiración para suscripciones mensuales
  let expiresAt: string | null = null;
  if (subscriptionType === 'dashboard' || subscriptionType === 'full_premium') {
    const expiryDate = new Date(approvalDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    expiresAt = expiryDate.toISOString();
  }

  const { data, error } = await supabase
    .from('profile_subscriptions')
    .update({
      status_psub: 'approved',
      approved_at_psub: approvalDate.toISOString(),
      approved_by_psub: user.id,
      expires_at_psub: expiresAt,
      updated_at_psub: approvalDate.toISOString(),
    } as never)
    .eq('id_psub', subscriptionId)
    .select()
    .single();

  if (error) throw error;

  return {
    subscription: data as ProfileSubscription,
    profileId,
    userName,
    packageName,
  };
}

export interface SubscriptionRejectionResult {
  subscription: ProfileSubscription;
  profileId: string;
  userName: string;
  packageName: string;
  rejectionReason?: string;
}

/**
 * Rechaza una suscripción
 */
export async function rejectSubscription(
  subscriptionId: string,
  rejectionReason?: string,
): Promise<SubscriptionRejectionResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No authenticated user');

  // Obtener la suscripción con datos del usuario y plan
  const { data: subscription, error: fetchError } = await supabase
    .from('profile_subscriptions')
    .select(
      `
            *,
            subscription:subscription_id_psub (
                name_sub
            ),
            profile:profile_id_psub (
                first_name_prf,
                last_name1_prf
            )
        `,
    )
    .eq('id_psub', subscriptionId)
    .single();

  if (fetchError) throw fetchError;
  if (!subscription) throw new Error('Suscripción no encontrada');

  const subscriptionData = subscription as any;
  const packageName = subscriptionData.subscription?.name_sub || 'Paquete Premium';
  const profileId = subscriptionData.profile_id_psub;

  // Nombre del usuario
  const firstName = subscriptionData.profile?.first_name_prf || '';
  const lastName = subscriptionData.profile?.last_name1_prf || '';
  const userName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

  const { data, error } = await supabase
    .from('profile_subscriptions')
    .update({
      status_psub: 'rejected',
      rejected_at_psub: new Date().toISOString(),
      rejected_by_psub: user.id,
      rejection_reason_psub: rejectionReason ?? null,
      updated_at_psub: new Date().toISOString(),
    } as never)
    .eq('id_psub', subscriptionId)
    .select()
    .single();

  if (error) throw error;

  return {
    subscription: data as ProfileSubscription,
    profileId,
    userName,
    packageName,
    rejectionReason,
  };
}

// ============================================
// Subscription Catalog (Admin CRUD)
// ============================================

/**
 * Obtiene todos los planes de suscripción de la BD (incluyendo inactivos)
 */
export async function getAllSubscriptionPlans(): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscription')
    .select('*')
    .order('display_order_sub', { ascending: true });

  if (error) throw error;
  return (data as Subscription[]) || [];
}

/**
 * Crea un nuevo plan de suscripción
 */
export async function createSubscriptionPlan(
  plan: Omit<Subscription, 'id_sub' | 'created_at_sub' | 'updated_at_sub'>,
): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscription')
    .insert(plan as never)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

/**
 * Actualiza un plan de suscripción
 */
export async function updateSubscriptionPlan(
  planId: string,
  updates: Partial<Omit<Subscription, 'id_sub' | 'created_at_sub'>>,
): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscription')
    .update({
      ...updates,
      updated_at_sub: new Date().toISOString(),
    } as never)
    .eq('id_sub', planId)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}

/**
 * Elimina un plan de suscripción (soft delete - desactiva)
 */
export async function deleteSubscriptionPlan(planId: string): Promise<void> {
  const { error } = await supabase
    .from('subscription')
    .update({
      is_active_sub: false,
      updated_at_sub: new Date().toISOString(),
    } as never)
    .eq('id_sub', planId);

  if (error) throw error;
}

/**
 * Activa un plan de suscripción
 */
export async function activateSubscriptionPlan(planId: string): Promise<Subscription> {
  const { data, error } = await supabase
    .from('subscription')
    .update({
      is_active_sub: true,
      updated_at_sub: new Date().toISOString(),
    } as never)
    .eq('id_sub', planId)
    .select()
    .single();

  if (error) throw error;
  return data as Subscription;
}
