import { supabase } from '@/lib/supabase/client';
import type { ResourceType, SubscriptionType } from '@/types/enums';
import {
    QuotaInfo,
    DEFAULT_RESOURCE_LIMITS,
    RESOURCE_TO_SUBSCRIPTION,
} from '@/types/entities/subscription';

// ============================================
// Types
// ============================================

interface SubscriptionUsageRow {
    id_sus: string;
    profile_subscription_id_sus: string;
    max_quota_sus: number;
    used_count_sus: number;
}

interface ApprovedSubscription {
    id_psub: string;
    subscription: {
        type_sub: SubscriptionType;
        quota_sub: number;
    } | null;
}

// ============================================
// Services
// ============================================

/**
 * Obtiene la información de cuota para un tipo de recurso y entidad
 */
export async function getResourceQuota(
    userId: string,
    resourceType: ResourceType,
    entityId: string,
    entityType: 'business' | 'attraction' | 'event'
): Promise<QuotaInfo> {
    const limits = DEFAULT_RESOURCE_LIMITS[resourceType];

    // 1. Obtener uso actual de las suscripciones para ESTE negocio específico
    const entityColumn = getEntityColumn(entityType);

    const { data: usageData, error: usageError } = await supabase
        .from('subscription_usage')
        .select(`
            id_sus,
            profile_subscription_id_sus,
            max_quota_sus,
            used_count_sus,
            profile_subscription:profile_subscription_id_sus (
                id_psub,
                status_psub
            )
        `)
        .eq('profile_id_sus', userId)
        .eq('resource_type_sus', resourceType)
        .eq(entityColumn, entityId);

    if (usageError) {
        console.error('Error fetching usage:', usageError);
        throw usageError;
    }

    // 2. Calcular cuota premium basada SOLO en registros de uso para ESTE negocio
    // que tengan suscripción aprobada
    let premiumQuota = 0;
    let premiumUsed = 0;
    let subscriptionIdToUse: string | undefined;

    for (const usage of (usageData as unknown as any[] || [])) {
        // Verificar que la suscripción esté aprobada
        const subscription = usage.profile_subscription;
        if (subscription?.status_psub !== 'approved') {
            continue;
        }

        premiumQuota += usage.max_quota_sus;
        premiumUsed += usage.used_count_sus;

        // Si tiene cuota disponible, guardar ID para usar
        if (!subscriptionIdToUse && usage.used_count_sus < usage.max_quota_sus) {
            subscriptionIdToUse = usage.profile_subscription_id_sus;
        }
    }

    // hasPremium solo si HAY registros de uso aprobados para ESTE negocio
    const hasPremium = premiumQuota > 0;

    // 3. Obtener conteo actual de recursos (productos/fotos/etc)
    const currentCount = await getCurrentResourceCount(resourceType, entityId, entityType);

    // 4. Calcular cuotas finales
    const freeQuota = limits.freeLimit;
    const totalQuota = freeQuota + premiumQuota;
    const usedCount = currentCount;
    const availableCount = Math.max(0, totalQuota - usedCount);
    const canAdd = availableCount > 0;

    return {
        freeQuota,
        premiumQuota,
        totalQuota,
        usedCount,
        availableCount,
        canAdd,
        hasPremium,
        subscriptionIdToUse,
    };
}

/**
 * Incrementa el contador de uso de una suscripción
 * Llamar cuando se crea un nuevo recurso (producto, foto, etc)
 * Busca automáticamente una suscripción aprobada con cuota disponible
 */
export async function incrementUsage(
    userId: string,
    resourceType: ResourceType,
    entityId: string,
    entityType: 'business' | 'attraction' | 'event'
): Promise<void> {
    const entityColumn = getEntityColumn(entityType);
    const entityData = getEntityData(entityType, entityId);
    const requiredSubscriptionType = RESOURCE_TO_SUBSCRIPTION[resourceType];

    // 1. Buscar suscripciones aprobadas del tipo requerido
    const { data: subscriptions, error: subError } = await supabase
        .from('profile_subscriptions')
        .select(`
      id_psub,
      subscription:subscription_id_psub (
        type_sub,
        quota_sub
      )
    `)
        .eq('profile_id_psub', userId)
        .eq('status_psub', 'approved');

    if (subError) throw subError;

    // Filtrar suscripciones relevantes
    const relevantSubs = (subscriptions as unknown as ApprovedSubscription[] || []).filter(
        (s) =>
            s.subscription?.type_sub === requiredSubscriptionType ||
            s.subscription?.type_sub === 'full_premium'
    );

    if (relevantSubs.length === 0) {
        throw new Error('No hay suscripciones aprobadas disponibles');
    }

    // 2. Buscar una suscripción con cuota disponible
    let subscriptionToUse: ApprovedSubscription | undefined;
    let existingUsage: SubscriptionUsageRow | undefined;

    for (const sub of relevantSubs) {
        const { data: usage, error: usageError } = await supabase
            .from('subscription_usage')
            .select('id_sus, used_count_sus, max_quota_sus')
            .eq('profile_subscription_id_sus', sub.id_psub)
            .eq('resource_type_sus', resourceType)
            .eq(entityColumn, entityId)
            .maybeSingle();

        if (usageError) {
            console.error('Error checking usage:', usageError);
            continue;
        }

        const maxQuota = sub.subscription?.quota_sub ?? 0;
        const currentUsed = (usage as any)?.used_count_sus ?? 0;

        // Si esta suscripción tiene cuota disponible
        if (currentUsed < maxQuota) {
            subscriptionToUse = sub;
            existingUsage = usage as unknown as SubscriptionUsageRow | undefined;
            break;
        }
    }

    if (!subscriptionToUse) {
        throw new Error('Todas las suscripciones han alcanzado su cuota máxima');
    }

    const maxQuota = subscriptionToUse.subscription?.quota_sub ?? 0;

    // 3. Actualizar o crear registro de uso
    if (existingUsage) {
        // Incrementar contador existente
        const newCount = existingUsage.used_count_sus + 1;
        if (newCount > maxQuota) {
            throw new Error('Cuota excedida');
        }

        const { error: updateError } = await (supabase as any)
            .from('subscription_usage')
            .update({ used_count_sus: newCount })
            .eq('id_sus', existingUsage.id_sus);

        if (updateError) throw updateError;
    } else {
        // Crear nuevo registro
        const insertData = {
            profile_subscription_id_sus: subscriptionToUse.id_psub,
            profile_id_sus: userId,
            resource_type_sus: resourceType,
            max_quota_sus: maxQuota,
            used_count_sus: 1,
            ...entityData,
        };

        const { error: insertError } = await (supabase as any)
            .from('subscription_usage')
            .insert(insertData);

        if (insertError) {
            console.error('Error inserting usage:', insertError);
            throw insertError;
        }
    }
}

/**
 * Decrementa el contador de uso de una suscripción
 * Llamar cuando se elimina un recurso (producto, foto, etc)
 */
export async function decrementUsage(
    userId: string,
    resourceType: ResourceType,
    entityId: string,
    entityType: 'business' | 'attraction' | 'event'
): Promise<void> {
    const entityColumn = getEntityColumn(entityType);

    // Buscar todos los registros de uso para esta entidad (puede haber varios de diferentes suscripciones)
    const { data: usages, error: findError } = await supabase
        .from('subscription_usage')
        .select('id_sus, used_count_sus')
        .eq('profile_id_sus', userId)
        .eq('resource_type_sus', resourceType)
        .eq(entityColumn, entityId)
        .gt('used_count_sus', 0)
        .order('created_at_sus', { ascending: false })
        .limit(1);

    if (findError) throw findError;

    if (usages && usages.length > 0) {
        const usage = usages[0];
        const newCount = (usage as any).used_count_sus - 1;

        const { error: updateError } = await (supabase as any)
            .from('subscription_usage')
            .update({ used_count_sus: newCount })
            .eq('id_sus', (usage as any).id_sus);

        if (updateError) throw updateError;
    }
    // Si no hay registro de uso, significa que era un recurso gratuito, no hace falta hacer nada
}

/**
 * Verifica si el usuario puede añadir un nuevo recurso
 * Retorna el ID de suscripción a usar si está en rango premium
 */
export async function canAddResource(
    userId: string,
    resourceType: ResourceType,
    entityId: string,
    entityType: 'business' | 'attraction' | 'event'
): Promise<{ allowed: boolean; subscriptionIdToUse?: string; quotaInfo: QuotaInfo }> {
    const quotaInfo = await getResourceQuota(userId, resourceType, entityId, entityType);

    return {
        allowed: quotaInfo.canAdd,
        subscriptionIdToUse: quotaInfo.subscriptionIdToUse,
        quotaInfo,
    };
}

// ============================================
// Helpers
// ============================================

function getEntityColumn(entityType: 'business' | 'attraction' | 'event'): string {
    switch (entityType) {
        case 'business':
            return 'business_id_sus';
        case 'attraction':
            return 'attraction_id_sus';
        case 'event':
            return 'event_id_sus';
    }
}

function getEntityData(
    entityType: 'business' | 'attraction' | 'event',
    entityId: string
): Record<string, string | null> {
    return {
        business_id_sus: entityType === 'business' ? entityId : null,
        attraction_id_sus: entityType === 'attraction' ? entityId : null,
        event_id_sus: entityType === 'event' ? entityId : null,
    };
}

/**
 * Obtiene el conteo actual de recursos según el tipo
 */
async function getCurrentResourceCount(
    resourceType: ResourceType,
    entityId: string,
    entityType: 'business' | 'attraction' | 'event'
): Promise<number> {
    switch (resourceType) {
        case 'product': {
            const { count, error } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('business_id_prd', entityId)
                .eq('is_active_prd', true);

            if (error) throw error;
            return count ?? 0;
        }

        case 'photo_business': {
            const { count, error } = await supabase
                .from('business_images')
                .select('*', { count: 'exact', head: true })
                .eq('business_id_bim', entityId)
                .like('image_type_bim', 'gallery%');

            if (error) throw error;
            return count ?? 0;
        }

        case 'photo_attraction': {
            const { count, error } = await supabase
                .from('attraction_images')
                .select('*', { count: 'exact', head: true })
                .eq('attraction_id_aim', entityId)
                .like('image_type_aim', 'gallery%');

            if (error) throw error;
            return count ?? 0;
        }

        case 'photo_event': {
            const { count, error } = await supabase
                .from('event_images')
                .select('*', { count: 'exact', head: true })
                .eq('event_id_eim', entityId)
                .like('image_type_eim', 'gallery%');

            if (error) throw error;
            return count ?? 0;
        }

        case 'promotion': {
            const { count, error } = await supabase
                .from('promotions')
                .select('*', { count: 'exact', head: true })
                .eq('business_id_prm', entityId)
                .eq('is_active_prm', true);

            if (error) throw error;
            return count ?? 0;
        }

        default:
            return 0;
    }
}
