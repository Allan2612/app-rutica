import { useState, useCallback, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useSubscriptions } from '@/features/user/hooks/useSubscriptions';
import { checkBusinessFullPremiumStatus } from '@/features/user/services/subscription.service';
import { getProfileById } from '@/features/auth/services/profile.service';
import { sendPaymentReceivedEmail } from '@/services/emailNotification.service';
import { useAuthStore } from '@/store';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';

type Step = 'plans' | 'business' | 'entity' | 'payment';
type PaymentMethod = 'sinpe' | 'transfer';
type EntityType = 'attraction' | 'event';

// Tipo para las selecciones de entidades por paquete
export type EntitySelection = {
  entityId: string;
  entityType: EntityType;
};
export type EntitySelections = Partial<Record<SubscriptionType, EntitySelection>>;

// Tipo para las selecciones de negocios por paquete
export type BusinessSelections = Partial<Record<SubscriptionType, string>>;

// Planes que requieren seleccionar un negocio
const BUSINESS_REQUIRED_PLANS: SubscriptionType[] = [
  'package_products',
  'gallery_business',
  'promotions',
  // 'dashboard' no requiere negocio - es una suscripción a nivel de perfil
  'full_premium', // Full premium también requiere negocio para productos
];

// Planes que requieren seleccionar atracción/evento
const ENTITY_REQUIRED_PLANS: SubscriptionType[] = ['gallery_attractions', 'gallery_events'];

interface UsePremiumModalParams {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (planNames: string, planCount: number) => void;
  onSubscribed?: () => void;
  initialPlan?: SubscriptionType;
  preSelectedBusinessId?: string;
  preSelectedEntityId?: string;
  preSelectedEntityType?: EntityType;
}

export function usePremiumModal({
  visible,
  onClose,
  onSuccess,
  onSubscribed,
  initialPlan,
  preSelectedBusinessId,
  preSelectedEntityId,
  preSelectedEntityType,
}: UsePremiumModalParams) {
  const { subscribe, isLoading, approvedSubscriptions, pendingSubscriptions } = useSubscriptions();
  const user = useAuthStore((state) => state.user);

  const [step, setStep] = useState<Step>(() => {
    // Si hay plan inicial con entidad o negocio pre-seleccionado, ir directo al pago
    if (initialPlan && preSelectedEntityId && preSelectedEntityType) {
      return 'payment';
    }
    if (initialPlan && preSelectedBusinessId) {
      return 'payment';
    }
    // Si hay plan inicial sin pre-selecciones, determinar el paso apropiado
    if (initialPlan) {
      if (BUSINESS_REQUIRED_PLANS.includes(initialPlan)) {
        return 'business';
      }
      if (ENTITY_REQUIRED_PLANS.includes(initialPlan)) {
        return 'entity';
      }
      return 'payment';
    }
    return 'plans';
  });
  const [selectedPlans, setSelectedPlans] = useState<SubscriptionType[]>(() =>
    initialPlan ? [initialPlan] : [],
  );
  // Mapa de paquete -> negocio seleccionado para soportar múltiples paquetes de negocio
  const [businessSelections, setBusinessSelections] = useState<BusinessSelections>(() => {
    if (initialPlan && preSelectedBusinessId) {
      return { [initialPlan]: preSelectedBusinessId };
    }
    return {};
  });
  // Mapa de paquete -> entidad seleccionada para soportar múltiples paquetes de entidad
  const [entitySelections, setEntitySelections] = useState<EntitySelections>(() => {
    if (initialPlan && preSelectedEntityId && preSelectedEntityType) {
      return {
        [initialPlan]: { entityId: preSelectedEntityId, entityType: preSelectedEntityType },
      };
    }
    return {};
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sinpe');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reiniciar estado cuando el modal se vuelve visible con props pre-seleccionadas
  useEffect(() => {
    if (visible) {
      // Restablecer al estado inicial basado en las props
      if (initialPlan && (preSelectedEntityId || preSelectedBusinessId)) {
        setStep('payment');
        setSelectedPlans([initialPlan]);

        if (preSelectedBusinessId) {
          setBusinessSelections({ [initialPlan]: preSelectedBusinessId });
        } else {
          setBusinessSelections({});
        }

        if (preSelectedEntityId && preSelectedEntityType) {
          setEntitySelections({
            [initialPlan]: { entityId: preSelectedEntityId, entityType: preSelectedEntityType },
          });
        } else {
          setEntitySelections({});
        }
      } else if (initialPlan) {
        // Si hay plan inicial sin pre-selecciones, determinar el paso apropiado
        if (BUSINESS_REQUIRED_PLANS.includes(initialPlan)) {
          setStep('business');
        } else if (ENTITY_REQUIRED_PLANS.includes(initialPlan)) {
          setStep('entity');
        } else {
          setStep('payment');
        }
        setSelectedPlans([initialPlan]);
        setBusinessSelections({});
        setEntitySelections({});
      } else {
        setStep('plans');
        setSelectedPlans([]);
        setBusinessSelections({});
        setEntitySelections({});
      }

      setPaymentMethod('sinpe');
      setPaymentReference('');
      setPaymentNote('');
      setError(null);
    }
  }, [visible, initialPlan, preSelectedBusinessId, preSelectedEntityId, preSelectedEntityType]);

  // Planes seleccionados que requieren un negocio
  const businessRequiredPlans = selectedPlans.filter((plan) =>
    BUSINESS_REQUIRED_PLANS.includes(plan),
  );

  // Verificar si hay planes que requieren seleccionar negocio
  const requiresBusinessSelection = businessRequiredPlans.length > 0;

  // Planes seleccionados que requieren una atracción/evento
  const entityRequiredPlans = selectedPlans.filter((plan) => ENTITY_REQUIRED_PLANS.includes(plan));

  // Verificar si hay planes que requieren seleccionar una atracción/evento
  const requiresEntitySelection = entityRequiredPlans.length > 0;

  const handleSelectPlan = useCallback((planType: SubscriptionType) => {
    setSelectedPlans((current) => {
      const isSelected = current.includes(planType);

      if (isSelected) {
        return current.filter((p) => p !== planType);
      } else {
        return [...current, planType];
      }
    });
    // Limpiar selecciones cuando cambian los planes
    setBusinessSelections({});
    setEntitySelections({});
    setError(null);
  }, []);

  const handleSelectBusiness = useCallback(
    async (planType: SubscriptionType, businessId: string) => {
      // Si es full_premium, verificar si este negocio ya tiene uno activo o pendiente
      if (planType === 'full_premium') {
        try {
          const { hasActive, hasPending } = await checkBusinessFullPremiumStatus(businessId);

          if (hasActive) {
            Toast.show({
              type: 'info',
              text1: 'Plan Premium Completo Activo',
              text2: 'Este negocio ya tiene el plan Premium Completo activado.',
              position: 'top',
              visibilityTime: 4000,
              topOffset: 100,
            });
            return;
          }

          if (hasPending) {
            Toast.show({
              type: 'info',
              text1: 'Plan Premium Completo Pendiente',
              text2: 'Este negocio ya tiene una solicitud pendiente del plan Premium Completo.',
              position: 'top',
              visibilityTime: 4000,
              topOffset: 100,
            });
            return;
          }
        } catch (err) {
          // Si hay error en la verificación, permitir continuar
          console.error('Error checking business full premium status:', err);
        }
      }

      setBusinessSelections((current) => ({
        ...current,
        [planType]: businessId,
      }));
      setError(null);
    },
    [],
  );

  const handleSelectEntity = useCallback(
    (planType: SubscriptionType, entityId: string, entityType: EntityType) => {
      setEntitySelections((current) => ({
        ...current,
        [planType]: { entityId, entityType },
      }));
      setError(null);
    },
    [],
  );

  const handleContinue = useCallback(() => {
    if (step === 'plans') {
      if (selectedPlans.length === 0) {
        setError('Selecciona al menos un plan para continuar');
        return;
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
      // Verificar que todos los planes que requieren negocio tengan uno seleccionado
      const missingBusinessSelections = businessRequiredPlans.filter(
        (plan) => !businessSelections[plan],
      );
      if (missingBusinessSelections.length > 0) {
        const missingNames = SUBSCRIPTION_PLANS.filter((p) =>
          missingBusinessSelections.includes(p.type),
        )
          .map((p) => p.name)
          .join(', ');
        setError(`Selecciona un negocio para: ${missingNames}`);
        return;
      }
      // Si también requiere selección de entidad, ir a ese paso
      if (requiresEntitySelection) {
        setStep('entity');
      } else {
        setStep('payment');
      }
      setError(null);
    } else if (step === 'entity') {
      // Verificar que todos los planes que requieren entidad tengan una seleccionada
      const missingSelections = entityRequiredPlans.filter((plan) => !entitySelections[plan]);
      if (missingSelections.length > 0) {
        const missingNames = SUBSCRIPTION_PLANS.filter((p) => missingSelections.includes(p.type))
          .map((p) => p.name)
          .join(', ');
        setError(`Selecciona una entidad para: ${missingNames}`);
        return;
      }
      setStep('payment');
      setError(null);
    }
  }, [
    step,
    selectedPlans,
    businessSelections,
    businessRequiredPlans,
    entitySelections,
    entityRequiredPlans,
    requiresBusinessSelection,
    requiresEntitySelection,
    approvedSubscriptions,
    pendingSubscriptions,
  ]);

  const handleBack = useCallback(() => {
    if (step === 'payment') {
      // Determinar a qué paso volver (en orden inverso al flujo)
      if (requiresEntitySelection) {
        setStep('entity');
      } else if (requiresBusinessSelection) {
        setStep('business');
      } else if (initialPlan) {
        // Si entró con un plan pre-seleccionado y no hay más pasos, cerrar
        onClose();
      } else {
        setStep('plans');
      }
      setError(null);
    } else if (step === 'entity') {
      // Desde entity, volver a business si hay paquetes que lo requieren
      if (requiresBusinessSelection) {
        setStep('business');
      } else if (initialPlan) {
        // Si entró con un plan pre-seleccionado, cerrar en lugar de volver a 'plans'
        onClose();
      } else {
        setStep('plans');
      }
      setError(null);
    } else if (step === 'business') {
      if (initialPlan) {
        // Si entró con un plan pre-seleccionado, cerrar en lugar de volver a 'plans'
        onClose();
      } else {
        setStep('plans');
      }
      setError(null);
    } else {
      onClose();
    }
  }, [step, requiresBusinessSelection, requiresEntitySelection, initialPlan, onClose]);

  const handleSubmit = useCallback(async () => {
    if (selectedPlans.length === 0) return;

    if (!paymentReference.trim()) {
      setError('El número de referencia es requerido');
      return;
    }

    // Validar que todos los planes que requieren negocio tengan uno seleccionado
    if (requiresBusinessSelection) {
      const missingBusinessSelections = businessRequiredPlans.filter(
        (plan) => !businessSelections[plan],
      );
      if (missingBusinessSelections.length > 0) {
        setError('Debes seleccionar un negocio para cada paquete');
        return;
      }
    }

    // Validar que todos los planes que requieren entidad tengan selección
    if (requiresEntitySelection) {
      const missingSelections = entityRequiredPlans.filter((plan) => !entitySelections[plan]);
      if (missingSelections.length > 0) {
        setError('Debes seleccionar una entidad para cada paquete');
        return;
      }
    }

    try {
      setError(null);
      // Pasar businessSelections y entitySelections al servicio
      await subscribe(
        selectedPlans,
        paymentReference.trim(),
        paymentNote.trim() || undefined,
        businessSelections,
        entitySelections,
      );

      const selectedPlanDetails = SUBSCRIPTION_PLANS.filter((plan) =>
        selectedPlans.includes(plan.type),
      );
      const planNames = selectedPlanDetails.map((plan) => plan.name).join(', ');
      const planCount = selectedPlans.length;

      // Calcular monto total
      const totalAmount = selectedPlanDetails.reduce((sum, plan) => sum + plan.priceValue, 0);
      const formattedAmount = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
      }).format(totalAmount);

      // Enviar correo de confirmación de pago (en background, no bloquea)
      if (user?.email && user?.id) {
        // Obtener nombre completo del perfil
        getProfileById(user.id)
          .then((profile) => {
            const firstName = profile?.first_name_prf || '';
            const lastName = profile?.last_name1_prf || '';
            const fullName =
              [firstName, lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || '';

            sendPaymentReceivedEmail({
              userEmail: user.email!,
              userName: fullName,
              packageName: planNames,
              amount: formattedAmount,
              paymentReference: paymentReference.trim(),
            });
          })
          .catch((err) => {
            console.error('[PremiumModal] Error getting profile for email:', err);
          });
      }

      setStep('plans');
      setSelectedPlans([]);
      setBusinessSelections({});
      setEntitySelections({});
      setPaymentMethod('sinpe');
      setPaymentReference('');
      setPaymentNote('');

      onClose();

      // Esperar a que el modal se cierre completamente antes de mostrar el toast
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Pago recibido',
          text2: 'Podrás disfrutar de tu paquete una vez aprobado el pago.',
          position: 'top',
          visibilityTime: 6000,
          topOffset: 100,
        });
        onSuccess?.(planNames, planCount);
        onSubscribed?.();
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al procesar la suscripción';
      setError(message);
    }
  }, [
    selectedPlans,
    businessSelections,
    businessRequiredPlans,
    entitySelections,
    entityRequiredPlans,
    requiresBusinessSelection,
    requiresEntitySelection,
    paymentReference,
    paymentNote,
    subscribe,
    onClose,
    onSuccess,
    onSubscribed,
    user,
  ]);

  const handleClose = useCallback(() => {
    setStep('plans');
    setSelectedPlans([]);
    setBusinessSelections({});
    setEntitySelections({});
    setPaymentMethod('sinpe');
    setPaymentReference('');
    setPaymentNote('');
    setError(null);
    onClose();
  }, [onClose]);

  return {
    step,
    selectedPlans,
    businessSelections,
    businessRequiredPlans,
    entitySelections,
    entityRequiredPlans,
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
