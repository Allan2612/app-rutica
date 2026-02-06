import { supabase } from '@/lib/supabase/client';
import type { ProfileSubscription, ProfileSubscriptionInsert, Subscription } from '@/types/entities';
import type { SubscriptionType, SubscriptionStatus } from '@/types/enums';

// ============================================
// Catálogo de Suscripciones
// ============================================

/**
 * Obtiene todos los planes de suscripción disponibles
 */
export async function getAllSubscriptionPlans(): Promise<Subscription[]> {
    const { data, error } = await supabase
        .from('subscription')
        .select('*')
        .eq('is_active_sub', true)
        .order('display_order_sub', { ascending: true });

    if (error) throw error;
    return (data as Subscription[]) || [];
}

/**
 * Obtiene un plan de suscripción por su tipo
 */
export async function getSubscriptionPlanByType(type: SubscriptionType): Promise<Subscription | null> {
    const { data, error } = await supabase
        .from('subscription')
        .select('*')
        .eq('type_sub', type)
        .maybeSingle();

    if (error) throw error;
    return data as Subscription | null;
}

/**
 * Obtiene un plan de suscripción por su ID
 */
export async function getSubscriptionPlanById(id: string): Promise<Subscription | null> {
    const { data, error } = await supabase
        .from('subscription')
        .select('*')
        .eq('id_sub', id)
        .maybeSingle();

    if (error) throw error;
    return data as Subscription | null;
}

// ============================================
// Queries
// ============================================

/**
 * Obtiene todas las suscripciones del usuario autenticado
 */
export async function getMySubscriptions(): Promise<ProfileSubscription[]> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
        .from('profile_subscriptions')
        .select(`
      *,
      subscription:subscription_id_psub (
        type_sub
      )
    `)
        .eq('profile_id_psub', user.id)
        .order('created_at_psub', { ascending: false });

    if (error) throw error;
    return (data as ProfileSubscription[]) || [];
}

/**
 * Obtiene solo las suscripciones aprobadas del usuario autenticado
 */
export async function getMyApprovedSubscriptions(): Promise<ProfileSubscription[]> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
        .from('profile_subscriptions')
        .select(`
      *,
      subscription:subscription_id_psub (
        type_sub
      )
    `)
        .eq('profile_id_psub', user.id)
        .eq('status_psub', 'approved')
        .order('approved_at_psub', { ascending: false });

    if (error) throw error;
    return (data as ProfileSubscription[]) || [];
}

/**
 * Obtiene las suscripciones pendientes del usuario autenticado
 */
export async function getMyPendingSubscriptions(): Promise<ProfileSubscription[]> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
        .from('profile_subscriptions')
        .select(`
      *,
      subscription:subscription_id_psub (
        type_sub
      )
    `)
        .eq('profile_id_psub', user.id)
        .eq('status_psub', 'pending')
        .order('created_at_psub', { ascending: false });

    if (error) throw error;
    return (data as ProfileSubscription[]) || [];
}

/**
 * Obtiene todas las suscripciones de un usuario por su ID (para admins)
 */
export async function getSubscriptionsByUserId(userId: string): Promise<ProfileSubscription[]> {
    const { data, error } = await supabase
        .from('profile_subscriptions')
        .select('*')
        .eq('profile_id_psub', userId)
        .order('created_at_psub', { ascending: false });

    if (error) throw error;
    return (data as ProfileSubscription[]) || [];
}

/**
 * Verifica si el usuario autenticado tiene al menos una suscripción aprobada
 */
export async function hasActiveSubscription(): Promise<boolean> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
        .from('profile_subscriptions')
        .select('id_psub')
        .eq('profile_id_psub', user.id)
        .eq('status_psub', 'approved')
        .limit(1)
        .maybeSingle();

    if (error) return false;
    return data !== null;
}

/**
 * Verifica si el usuario tiene un tipo específico de suscripción aprobada
 */
export async function hasSubscriptionType(
    userId: string,
    type: SubscriptionType
): Promise<boolean> {
    // Primero obtener el ID del plan
    const plan = await getSubscriptionPlanByType(type);
    if (!plan) return false;

    const { data } = await supabase
        .from('profile_subscriptions')
        .select('id_psub')
        .eq('profile_id_psub', userId)
        .eq('status_psub', 'approved')
        .eq('subscription_id_psub', plan.id_sub)
        .limit(1)
        .maybeSingle();

    if (!data) return false;

    return true;
}

/**
 * Verifica si el usuario tiene el plan full_premium (que incluye todo)
 */
export async function hasFullPremium(userId: string): Promise<boolean> {
    return hasSubscriptionType(userId, 'full_premium');
}

/**
 * Verifica si el usuario tiene acceso a un tipo de suscripción
 * (ya sea porque tiene ese tipo específico o tiene full_premium)
 */
export async function hasAccessToSubscriptionType(
    userId: string,
    type: SubscriptionType
): Promise<boolean> {
    // full_premium incluye todos los beneficios
    const hasFull = await hasFullPremium(userId);
    if (hasFull) return true;

    return hasSubscriptionType(userId, type);
}

// ============================================
// Mutations
// ============================================

/**
 * Crea una nueva suscripción para el usuario autenticado
 * Cada suscripción inicia en estado 'pending' y debe ser aprobada por un admin
 */
export async function createSubscription(
    subscriptionType: SubscriptionType,
    paymentReference: string,
    paymentNote?: string
): Promise<ProfileSubscription> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

    // Obtener el ID del plan de suscripción
    const plan = await getSubscriptionPlanByType(subscriptionType);
    if (!plan) throw new Error(`Subscription plan '${subscriptionType}' not found`);

    const insertData: ProfileSubscriptionInsert = {
        profile_id_psub: user.id,
        subscription_id_psub: plan.id_sub,
        payment_reference_psub: paymentReference,
        payment_note_psub: paymentNote ?? null,
    };

    const { data, error } = await supabase
        .from('profile_subscriptions')
        .insert(insertData as never)
        .select()
        .single();

    if (error) throw error;
    return data as ProfileSubscription;
}

/**
 * Crea múltiples suscripciones en una sola operación
 * Útil cuando el usuario compra varios paquetes a la vez
 * @param subscriptionTypes - Tipos de suscripción a crear
 * @param paymentReference - Referencia de pago
 * @param paymentNote - Nota opcional del pago
 * @param businessId - ID del negocio al que aplicar (requerido para paquetes de productos/galería business)
 * @param entityId - ID de la atracción/evento al que aplicar (para gallery_attractions)
 * @param entityType - Tipo de entidad: 'attraction' o 'event'
 */
export async function createMultipleSubscriptions(
    subscriptionTypes: SubscriptionType[],
    paymentReference: string,
    paymentNote?: string,
    businessId?: string,
    entityId?: string,
    entityType?: 'attraction' | 'event'
): Promise<ProfileSubscription[]> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

    // Obtener los IDs de los planes de suscripción
    const planPromises = subscriptionTypes.map(type => getSubscriptionPlanByType(type));
    const plans = await Promise.all(planPromises);

    // Verificar que todos los planes existan
    const validPlans = plans.filter((plan): plan is Subscription => plan !== null);
    if (validPlans.length !== subscriptionTypes.length) {
        throw new Error('Some subscription plans were not found');
    }

    // Crear un registro por cada tipo de suscripción
    const insertData: ProfileSubscriptionInsert[] = validPlans.map(plan => ({
        profile_id_psub: user.id,
        subscription_id_psub: plan.id_sub,
        payment_reference_psub: paymentReference,
        payment_note_psub: paymentNote ?? null,
    }));

    const { data, error } = await supabase
        .from('profile_subscriptions')
        .insert(insertData as never)
        .select();

    if (error) throw error;

    const createdSubscriptions = (data as ProfileSubscription[]) || [];

    // Si hay businessId, crear registros en subscription_usage para vincular
    // la suscripción al negocio específico
    if (businessId && createdSubscriptions.length > 0) {
        await createSubscriptionUsageRecords(user.id, createdSubscriptions, validPlans, businessId);
    }

    // Si hay entityId (atracción/evento), crear registros de usage
    if (entityId && entityType && createdSubscriptions.length > 0) {
        await createEntitySubscriptionUsageRecords(user.id, createdSubscriptions, validPlans, entityId, entityType);
    }

    return createdSubscriptions;
}

/**
 * Crea registros de subscription_usage para vincular suscripciones a un negocio
 */
async function createSubscriptionUsageRecords(
    userId: string,
    subscriptions: ProfileSubscription[],
    plans: Subscription[],
    businessId: string
): Promise<void> {
    // Mapear tipo de suscripción a tipo de recurso y cuota
    const subscriptionConfig: Partial<Record<SubscriptionType, { resourceType: string; quota: number }>> = {
        'package_products': { resourceType: 'product', quota: 20 },
        'gallery_business': { resourceType: 'photo_business', quota: 10 },
        'promotions': { resourceType: 'promotion', quota: 10 },
        // dashboard no consume recursos directos
    };

    const usageInserts: Array<{
        profile_subscription_id_sus: string;
        profile_id_sus: string;
        resource_type_sus: string;
        business_id_sus: string;
        max_quota_sus: number;
        used_count_sus: number;
    }> = [];

    for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        const plan = plans[i];

        if (plan.type_sub === 'full_premium') {
            // Full premium - crear usage para productos, fotos y promociones
            usageInserts.push({
                profile_subscription_id_sus: subscription.id_psub,
                profile_id_sus: userId,
                resource_type_sus: 'product',
                business_id_sus: businessId,
                max_quota_sus: 20, // 20 productos
                used_count_sus: 0,
            });
            usageInserts.push({
                profile_subscription_id_sus: subscription.id_psub,
                profile_id_sus: userId,
                resource_type_sus: 'photo_business',
                business_id_sus: businessId,
                max_quota_sus: 10, // 10 fotos de galería
                used_count_sus: 0,
            });
            usageInserts.push({
                profile_subscription_id_sus: subscription.id_psub,
                profile_id_sus: userId,
                resource_type_sus: 'promotion',
                business_id_sus: businessId,
                max_quota_sus: 10, // 10 promociones
                used_count_sus: 0,
            });
        } else {
            const config = subscriptionConfig[plan.type_sub as SubscriptionType];
            if (config) {
                usageInserts.push({
                    profile_subscription_id_sus: subscription.id_psub,
                    profile_id_sus: userId,
                    resource_type_sus: config.resourceType,
                    business_id_sus: businessId,
                    max_quota_sus: config.quota,
                    used_count_sus: 0,
                });
            }
        }
    }

    if (usageInserts.length > 0) {
        const { error: usageError } = await supabase
            .from('subscription_usage')
            .insert(usageInserts as never);

        if (usageError) {
            console.error('Error creating subscription_usage records:', usageError);
            // No lanzamos error para no bloquear la creación de la suscripción
            // El admin puede crear estos registros manualmente al aprobar
        }
    }
}

/**
 * Crea registros de subscription_usage para vincular suscripciones a una atracción o evento
 */
async function createEntitySubscriptionUsageRecords(
    userId: string,
    subscriptions: ProfileSubscription[],
    plans: Subscription[],
    entityId: string,
    entityType: 'attraction' | 'event'
): Promise<void> {
    const usageInserts: Array<{
        profile_subscription_id_sus: string;
        profile_id_sus: string;
        resource_type_sus: string;
        attraction_id_sus?: string;
        event_id_sus?: string;
        max_quota_sus: number;
        used_count_sus: number;
    }> = [];

    for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        const plan = plans[i];

        // Solo procesar gallery_attractions
        if (plan.type_sub === 'gallery_attractions') {
            const baseRecord = {
                profile_subscription_id_sus: subscription.id_psub,
                profile_id_sus: userId,
                max_quota_sus: 10, // 10 fotos de galería
                used_count_sus: 0,
            };

            if (entityType === 'attraction') {
                usageInserts.push({
                    ...baseRecord,
                    resource_type_sus: 'photo_attraction',
                    attraction_id_sus: entityId,
                });
            } else if (entityType === 'event') {
                usageInserts.push({
                    ...baseRecord,
                    resource_type_sus: 'photo_event',
                    event_id_sus: entityId,
                });
            }
        }
    }

    if (usageInserts.length > 0) {
        const { error: usageError } = await supabase
            .from('subscription_usage')
            .insert(usageInserts as never);

        if (usageError) {
            console.error('Error creating entity subscription_usage records:', usageError);
            // No lanzamos error para no bloquear la creación de la suscripción
        }
    }
}

/**
 * Cancela una suscripción pendiente (solo el usuario puede cancelar sus propias suscripciones pendientes)
 */
export async function cancelPendingSubscription(subscriptionId: string): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('No authenticated user');

    const { error } = await supabase
        .from('profile_subscriptions')
        .update({
            status_psub: 'cancelled',
            cancelled_at_psub: new Date().toISOString(),
            updated_at_psub: new Date().toISOString(),
        } as never)
        .eq('id_psub', subscriptionId)
        .eq('profile_id_psub', user.id)
        .eq('status_psub', 'pending');

    if (error) throw error;
}

// ============================================
// Admin Functions
// ============================================

/**
 * Aprueba una suscripción (solo admins)
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
        .eq('status_psub', 'pending')
        .select()
        .single();

    if (error) throw error;
    return data as ProfileSubscription;
}

/**
 * Rechaza una suscripción (solo admins)
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
        .eq('status_psub', 'pending')
        .select()
        .single();

    if (error) throw error;
    return data as ProfileSubscription;
}

/**
 * Obtiene todas las suscripciones pendientes de aprobación (solo admins)
 */
export async function getAllPendingSubscriptions(): Promise<ProfileSubscription[]> {
    const { data, error } = await supabase
        .from('profile_subscriptions')
        .select('*')
        .eq('status_psub', 'pending')
        .order('created_at_psub', { ascending: true });

    if (error) throw error;
    return (data as ProfileSubscription[]) || [];
}
