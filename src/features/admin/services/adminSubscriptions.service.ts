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
    total: number;
}

// ============================================
// Profile Subscriptions (Admin)
// ============================================

/**
 * Obtiene todas las suscripciones con detalles del perfil y plan
 */
export async function getAllSubscriptionsWithDetails(
    filters?: SubscriptionFilters
): Promise<ProfileSubscriptionWithDetails[]> {
    let query = supabase
        .from('profile_subscriptions')
        .select(`
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
        `)
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
        results = results.filter(sub => {
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
            return fullName.includes(searchLower) ||
                planName.includes(searchLower) ||
                paymentRef.includes(searchLower);
        });
    }

    return results;
}

/**
 * Obtiene estadísticas de suscripciones
 */
export async function getSubscriptionStats(): Promise<SubscriptionStats> {
    const { data, error } = await supabase
        .from('profile_subscriptions')
        .select('status_psub');

    if (error) throw error;

    const stats: SubscriptionStats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
        total: 0,
    };

    ((data || []) as { status_psub: SubscriptionStatus }[]).forEach(sub => {
        stats.total++;
        const status = sub.status_psub;
        if (status in stats) {
            stats[status]++;
        }
    });

    return stats;
}

/**
 * Aprueba una suscripción
 */
export async function approveSubscription(subscriptionId: string): Promise<ProfileSubscription> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
        .from('profile_subscriptions')
        .update({
            status_psub: 'approved',
            approved_at_psub: new Date().toISOString(),
            approved_by_psub: user.id,
            updated_at_psub: new Date().toISOString(),
        } as never)
        .eq('id_psub', subscriptionId)
        .select()
        .single();

    if (error) throw error;
    return data as ProfileSubscription;
}

/**
 * Rechaza una suscripción
 */
export async function rejectSubscription(
    subscriptionId: string,
    rejectionReason?: string
): Promise<ProfileSubscription> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

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
    return data as ProfileSubscription;
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
    plan: Omit<Subscription, 'id_sub' | 'created_at_sub' | 'updated_at_sub'>
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
    updates: Partial<Omit<Subscription, 'id_sub' | 'created_at_sub'>>
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
