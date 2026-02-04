import { useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useSubscriptions } from '@/features/user/hooks/useSubscriptions';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';

type Step = 'plans' | 'payment';
type PaymentMethod = 'sinpe' | 'transfer';

interface UsePremiumModalParams {
    onClose: () => void;
    onSuccess?: (planNames: string, planCount: number) => void;
}

export function usePremiumModal({ onClose, onSuccess }: UsePremiumModalParams) {
    const { subscribe, isLoading, approvedSubscriptions, pendingSubscriptions } = useSubscriptions();

    const [step, setStep] = useState<Step>('plans');
    const [selectedPlans, setSelectedPlans] = useState<SubscriptionType[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sinpe');
    const [paymentReference, setPaymentReference] = useState('');
    const [paymentNote, setPaymentNote] = useState('');
    const [error, setError] = useState<string | null>(null);

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

            setStep('payment');
            setError(null);
        }
    }, [step, selectedPlans, approvedSubscriptions, pendingSubscriptions]);

    const handleBack = useCallback(() => {
        if (step === 'payment') {
            setStep('plans');
            setError(null);
        } else {
            onClose();
        }
    }, [step, onClose]);

    const handleSubmit = useCallback(async () => {
        if (selectedPlans.length === 0) return;

        if (!paymentReference.trim()) {
            setError('El número de referencia es requerido');
            return;
        }

        try {
            setError(null);
            await subscribe(selectedPlans, paymentReference.trim(), paymentNote.trim() || undefined);

            const planNames = SUBSCRIPTION_PLANS
                .filter(plan => selectedPlans.includes(plan.type))
                .map(plan => plan.name)
                .join(', ');

            const planCount = selectedPlans.length;

            setStep('plans');
            setSelectedPlans([]);
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
    }, [selectedPlans, paymentReference, paymentNote, subscribe, onClose, onSuccess]);

    const handleClose = useCallback(() => {
        setStep('plans');
        setSelectedPlans([]);
        setPaymentMethod('sinpe');
        setPaymentReference('');
        setPaymentNote('');
        setError(null);
        onClose();
    }, [onClose]);

    return {
        step,
        selectedPlans,
        paymentMethod,
        paymentReference,
        paymentNote,
        error,
        isLoading,
        setPaymentMethod,
        setPaymentReference,
        setPaymentNote,
        handleSelectPlan,
        handleContinue,
        handleBack,
        handleSubmit,
        handleClose,
    };
}
