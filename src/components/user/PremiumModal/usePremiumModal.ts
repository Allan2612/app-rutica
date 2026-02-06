import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useSubscriptions } from '@/features/user/hooks/useSubscriptions';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';

type Step = 'plans' | 'business' | 'payment';
type PaymentMethod = 'sinpe' | 'transfer';

// Planes que requieren seleccionar un negocio
const BUSINESS_REQUIRED_PLANS: SubscriptionType[] = [
    'package_products',
    'gallery_business',
    'promotions',
    'dashboard',
    'full_premium', // Full premium también requiere negocio para productos
];

interface UsePremiumModalParams {
    onClose: () => void;
    onSuccess?: (planNames: string, planCount: number) => void;
}

export function usePremiumModal({ onClose, onSuccess }: UsePremiumModalParams) {
    const { subscribe, isLoading, approvedSubscriptions, pendingSubscriptions } = useSubscriptions();

    const [step, setStep] = useState<Step>('plans');
    const [selectedPlans, setSelectedPlans] = useState<SubscriptionType[]>([]);
    const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sinpe');
    const [paymentReference, setPaymentReference] = useState('');
    const [paymentNote, setPaymentNote] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Verificar si los planes seleccionados requieren un negocio
    const requiresBusinessSelection = selectedPlans.some(plan =>
        BUSINESS_REQUIRED_PLANS.includes(plan)
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
        // Limpiar negocio seleccionado cuando cambian los planes
        setSelectedBusinessId(null);
        setError(null);
    }, []);

    const handleSelectBusiness = useCallback((businessId: string) => {
        setSelectedBusinessId(businessId);
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
        }
    }, [step, selectedPlans, selectedBusinessId, requiresBusinessSelection, approvedSubscriptions, pendingSubscriptions]);

    const handleBack = useCallback(() => {
        if (step === 'payment') {
            // Si había paso de negocio, volver a él
            if (requiresBusinessSelection) {
                setStep('business');
            } else {
                setStep('plans');
            }
            setError(null);
        } else if (step === 'business') {
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

        try {
            setError(null);
            // Pasar businessId al servicio si aplica
            await subscribe(
                selectedPlans,
                paymentReference.trim(),
                paymentNote.trim() || undefined,
                selectedBusinessId || undefined
            );

            const planNames = SUBSCRIPTION_PLANS
                .filter(plan => selectedPlans.includes(plan.type))
                .map(plan => plan.name)
                .join(', ');

            const planCount = selectedPlans.length;

            setStep('plans');
            setSelectedPlans([]);
            setSelectedBusinessId(null);
            setPaymentMethod('sinpe');
            setPaymentReference('');
            setPaymentNote('');

            onClose();

            setTimeout(() => {
                onSuccess?.(planNames, planCount);
            }, 100);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al procesar la suscripción';
            setError(message);
        }
    }, [selectedPlans, selectedBusinessId, requiresBusinessSelection, paymentReference, paymentNote, subscribe, onClose, onSuccess]);

    const handleClose = useCallback(() => {
        setStep('plans');
        setSelectedPlans([]);
        setSelectedBusinessId(null);
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
        requiresBusinessSelection,
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
        handleContinue,
        handleBack,
        handleSubmit,
        handleClose,
    };
}
