import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store';
import {
    getMySubscriptions,
    getMyApprovedSubscriptions,
    getMyPendingSubscriptions,
    createMultipleSubscriptions,
    cancelPendingSubscription,
    hasActiveSubscription,
} from '@/features/user/services/subscription.service';
import type { ProfileSubscription } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';

// Tipo para las selecciones de entidades por paquete
export type EntitySelection = {
    entityId: string;
    entityType: 'attraction' | 'event';
};
export type EntitySelections = Partial<Record<SubscriptionType, EntitySelection>>;

// Tipo para las selecciones de negocios por paquete
export type BusinessSelections = Partial<Record<SubscriptionType, string>>;

interface UseSubscriptionsReturn {
    subscriptions: ProfileSubscription[];
    approvedSubscriptions: ProfileSubscription[];
    pendingSubscriptions: ProfileSubscription[];
    isPremium: boolean;
    isLoading: boolean;
    error: string | null;
    subscribe: (
        subscriptionTypes: SubscriptionType[],
        paymentReference: string,
        paymentNote?: string,
        businessSelections?: BusinessSelections,
        entitySelections?: EntitySelections
    ) => Promise<ProfileSubscription[]>;
    cancelSubscription: (subscriptionId: string) => Promise<void>;
    refreshSubscriptions: () => Promise<void>;
}

/**
 * Hook para manejar las suscripciones premium del usuario
 */
export function useSubscriptions(): UseSubscriptionsReturn {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [subscriptions, setSubscriptions] = useState<ProfileSubscription[]>([]);
    const [approvedSubscriptions, setApprovedSubscriptions] = useState<ProfileSubscription[]>([]);
    const [pendingSubscriptions, setPendingSubscriptions] = useState<ProfileSubscription[]>([]);
    const [isPremium, setIsPremium] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSubscriptions = useCallback(async () => {
        if (!user?.id || !isAuthenticated) {
            setSubscriptions([]);
            setApprovedSubscriptions([]);
            setPendingSubscriptions([]);
            setIsPremium(false);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const [all, approved, pending, hasActive] = await Promise.all([
                getMySubscriptions(),
                getMyApprovedSubscriptions(),
                getMyPendingSubscriptions(),
                hasActiveSubscription(),
            ]);

            setSubscriptions(all);
            setApprovedSubscriptions(approved);
            setPendingSubscriptions(pending);
            setIsPremium(hasActive);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al cargar suscripciones';
            setError(message);
            setSubscriptions([]);
            setApprovedSubscriptions([]);
            setPendingSubscriptions([]);
            setIsPremium(false);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, isAuthenticated]);

    const subscribe = useCallback(
        async (
            subscriptionTypes: SubscriptionType[],
            paymentReference: string,
            paymentNote?: string,
            businessSelections?: BusinessSelections,
            entitySelections?: EntitySelections
        ): Promise<ProfileSubscription[]> => {
            if (!user?.id) {
                throw new Error('No hay usuario autenticado');
            }

            try {
                setIsLoading(true);
                setError(null);
                const newSubscriptions = await createMultipleSubscriptions(
                    subscriptionTypes,
                    paymentReference,
                    paymentNote,
                    businessSelections,
                    entitySelections
                );

                // Recargar todas las suscripciones después de crear nuevas
                await loadSubscriptions();

                return newSubscriptions;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error al crear suscripciones';
                setError(message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [user?.id, loadSubscriptions]
    );

    const cancelSubscription = useCallback(async (subscriptionId: string) => {
        if (!user?.id) {
            throw new Error('No hay usuario autenticado');
        }

        try {
            setIsLoading(true);
            setError(null);
            await cancelPendingSubscription(subscriptionId);

            // Recargar suscripciones después de cancelar
            await loadSubscriptions();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al cancelar suscripción';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [user?.id, loadSubscriptions]);

    const refreshSubscriptions = useCallback(async () => {
        await loadSubscriptions();
    }, [loadSubscriptions]);

    useEffect(() => {
        loadSubscriptions();
    }, [loadSubscriptions]);

    return {
        subscriptions,
        approvedSubscriptions,
        pendingSubscriptions,
        isPremium,
        isLoading,
        error,
        subscribe,
        cancelSubscription,
        refreshSubscriptions,
    };
}
