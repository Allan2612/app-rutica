import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useSubscriptions } from '@/features/user/hooks/useSubscriptions';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';

type Step = 'plans' | 'business' | 'entity' | 'payment';
type PaymentMethod = 'sinpe' | 'transfer';
type EntityType = 'attraction' | 'event';

// Planes que requieren seleccionar un negocio
const BUSINESS_REQUIRED_PLANS: SubscriptionType[] = [
    'package_products',
    'gallery_business',
    'promotions',
    // 'dashboard' no requiere negocio - es una suscripción a nivel de perfil
    'full_premium', // Full premium también requiere negocio para productos
];

// Planes que requieren seleccionar atracción/evento
const ENTITY_REQUIRED_PLANS: SubscriptionType[] = [
    'gallery_attractions',
];

interface UsePremiumModalParams {
    onClose: () => void;
    onSuccess?: (planNames: string, planCount: number) => void;
    onSubscribed?: () => void;
    initialPlan?: SubscriptionType;
    preSelectedEntityId?: string;
    preSelectedEntityType?: EntityType;
}

export function usePremiumModal({
    onClose,
    onSuccess,
    onSubscribed,
    initialPlan,
    preSelectedEntityId,
    preSelectedEntityType,
}: UsePremiumModalParams) {
    const { subscribe, isLoading, approvedSubscriptions, pendingSubscriptions } = useSubscriptions();

    const [step, setStep] = useState<Step>(() => {
        // Si hay plan inicial con entidad pre-seleccionada, ir directo al pago
        if (initialPlan && preSelectedEntityId && preSelectedEntityType) {
            return 'payment';
        }
        return 'plans';
    });
    const [selectedPlans, setSelectedPlans] = useState<SubscriptionType[]>(() =>
        initialPlan ? [initialPlan] : []
    );
    const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(
        preSelectedEntityId ?? null
    );
    const [selectedEntityType, setSelectedEntityType] = useState<EntityType | null>(
        preSelectedEntityType ?? null
    );
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sinpe');
    const [paymentReference, setPaymentReference] = useState('');
    const [paymentNote, setPaymentNote] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Verificar si los planes seleccionados requieren un negocio
    const requiresBusinessSelection = selectedPlans.some(plan =>
        BUSINESS_REQUIRED_PLANS.includes(plan)
    );

    // Verificar si los planes seleccionados requieren una atracción/evento
    const requiresEntitySelection = selectedPlans.some(plan =>
        ENTITY_REQUIRED_PLANS.includes(plan)
    );

    const handleSelectPlan = useCallback((planType: SubscriptionType) => {
        setSelectedPlans(current => {
            const isSelected = current.includes(planType);

            if (planType === 'full_premium') {
                return isSelected ? [] : ['full_premium'];
            }

            if (current.includes('full_premium')) {
                return [planType];
            }

            if (isSelected) {
                return current.filter(p => p !== planType);
            } else {
                return [...current, planType];
            }
        });
        // Limpiar selecciones cuando cambian los planes
        setSelectedBusinessId(null);
        setSelectedEntityId(null);
        setSelectedEntityType(null);
        setError(null);
    }, []);

    const handleSelectBusiness = useCallback((businessId: string) => {
        setSelectedBusinessId(businessId);
        setError(null);
    }, []);

    const handleSelectEntity = useCallback((entityId: string, entityType: EntityType) => {
        setSelectedEntityId(entityId);
        setSelectedEntityType(entityType);
        setError(null);
    }, []);

    const handleContinue = useCallback(() => {
        if (step === 'plans') {
            if (selectedPlans.length === 0) {
                setError('Selecciona al menos un plan para continuar');
                return;
            }

            if (selectedPlans.includes('full_premium')) {
                const hasActiveFullPremium = approvedSubscriptions.some(
                    sub => sub.subscription?.type_sub === 'full_premium'
                );

                const hasPendingFullPremium = pendingSubscriptions.some(
                    sub => sub.subscription?.type_sub === 'full_premium'
                );

                if (hasActiveFullPremium) {
                    Toast.show({
                        type: 'info',
                        text1: 'Plan Premium Completo Activo',
                        text2: 'Ya tienes el plan Premium Completo activado. No es necesario comprarlo nuevamente.',
                        position: 'top',
                        visibilityTime: 4000,
                        topOffset: 100,
                    });
                    return;
                }

                if (hasPendingFullPremium) {
                    Toast.show({
                        type: 'info',
                        text1: 'Plan Premium Completo Pendiente',
                        text2: 'Ya tienes una solicitud pendiente del plan Premium Completo. Espera a que sea aprobada antes de comprarlo nuevamente.',
                        position: 'top',
                        visibilityTime: 4000,
                        topOffset: 100,
                    });
                    return;
                }
            }

            // Si requiere seleccionar negocio, ir al paso de negocio
            if (requiresBusinessSelection) {
                setStep('business');
            } else if (requiresEntitySelection) {
                // Si requiere seleccionar atracción/evento, ir al paso de entity
                setStep('entity');
            } else {
                setStep('payment');
            }
            setError(null);
        } else if (step === 'business') {
            if (!selectedBusinessId) {
                setError('Selecciona un negocio para continuar');
                return;
            }
            setStep('payment');
            setError(null);
        } else if (step === 'entity') {
            if (!selectedEntityId || !selectedEntityType) {
                setError('Selecciona una atracción o evento para continuar');
                return;
            }
            setStep('payment');
            setError(null);
        }
    }, [step, selectedPlans, selectedBusinessId, selectedEntityId, selectedEntityType, requiresBusinessSelection, requiresEntitySelection, approvedSubscriptions, pendingSubscriptions]);

    const handleBack = useCallback(() => {
        if (step === 'payment') {
            // Determinar a qué paso volver
            if (requiresBusinessSelection) {
                setStep('business');
            } else if (requiresEntitySelection) {
                setStep('entity');
            } else {
                setStep('plans');
            }
            setError(null);
        } else if (step === 'business') {
            setStep('plans');
            setError(null);
        } else if (step === 'entity') {
            setStep('plans');
            setError(null);
        } else {
            onClose();
        }
    }, [step, requiresBusinessSelection, onClose]);

    const handleSubmit = useCallback(async () => {
        if (selectedPlans.length === 0) return;

        if (!paymentReference.trim()) {
            setError('El número de referencia es requerido');
            return;
        }

        // Validar que si se requiere negocio, esté seleccionado
        if (requiresBusinessSelection && !selectedBusinessId) {
            setError('Debes seleccionar un negocio');
            return;
        }

        // Validar que si se requiere entidad, esté seleccionada
        if (requiresEntitySelection && (!selectedEntityId || !selectedEntityType)) {
            setError('Debes seleccionar una atracción o evento');
            return;
        }

        try {
            setError(null);
            // Pasar businessId y entityId/entityType al servicio según aplique
            await subscribe(
                selectedPlans,
                paymentReference.trim(),
                paymentNote.trim() || undefined,
                selectedBusinessId || undefined,
                selectedEntityId || undefined,
                selectedEntityType || undefined
            );

            const planNames = SUBSCRIPTION_PLANS
                .filter(plan => selectedPlans.includes(plan.type))
                .map(plan => plan.name)
                .join(', ');

            const planCount = selectedPlans.length;

            setStep('plans');
            setSelectedPlans([]);
            setSelectedBusinessId(null);
            setSelectedEntityId(null);
            setSelectedEntityType(null);
            setPaymentMethod('sinpe');
            setPaymentReference('');
            setPaymentNote('');

            onClose();

            setTimeout(() => {
                onSuccess?.(planNames, planCount);
                onSubscribed?.();
            }, 100);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al procesar la suscripción';
            setError(message);
        }
    }, [selectedPlans, selectedBusinessId, selectedEntityId, selectedEntityType, requiresBusinessSelection, requiresEntitySelection, paymentReference, paymentNote, subscribe, onClose, onSuccess, onSubscribed]);

    const handleClose = useCallback(() => {
        setStep('plans');
        setSelectedPlans([]);
        setSelectedBusinessId(null);
        setSelectedEntityId(null);
        setSelectedEntityType(null);
        setPaymentMethod('sinpe');
        setPaymentReference('');
        setPaymentNote('');
        setError(null);
        onClose();
    }, [onClose]);

    return {
        step,
        selectedPlans,
        selectedBusinessId,
        selectedEntityId,
        selectedEntityType,
        requiresBusinessSelection,
        requiresEntitySelection,
        paymentMethod,
        paymentReference,
        paymentNote,
        error,
        isLoading,
        setPaymentMethod,
        setPaymentReference,
        setPaymentNote,
        handleSelectPlan,
        handleSelectBusiness,
        handleSelectEntity,
        handleContinue,
        handleBack,
        handleSubmit,
        handleClose,
    };
}
