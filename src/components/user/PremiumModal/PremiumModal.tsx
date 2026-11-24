import { memo, useCallback } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { usePaymentSettings } from '@/hooks/usePaymentSettings';
import { AccessibleModal } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import type { UserRole } from '@/types/enums';
import { StepIndicator } from './StepIndicator';
import { PlansStep } from './PlansStep';
import { BusinessStep } from './BusinessStep';
import { EntityStep } from './EntityStep';
import { PaymentStep } from './PaymentStep';
import { ModalHeader } from './ModalHeader';
import { BuyerNotice } from './BuyerNotice';
import { ModalFooter } from './ModalFooter';
import { ToastConfig } from './ToastConfig';
import { usePremiumModal } from './usePremiumModal';
import { styles } from './styles';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (planNames: string, planCount: number) => void;
  onInfo?: (title: string, message: string) => void;
  onSubscribed?: () => void;
  userRole?: UserRole | null;
  initialPlan?: import('@/types/enums').SubscriptionType;
  preSelectedBusinessId?: string;
  preSelectedBusinessName?: string;
  preSelectedEntityId?: string;
  preSelectedEntityType?: 'attraction' | 'event';
  preSelectedEntityName?: string;
}

export const PremiumModal = memo(function PremiumModal({
  visible,
  onClose,
  onSuccess,
  onInfo,
  onSubscribed,
  userRole,
  initialPlan,
  preSelectedBusinessId,
  preSelectedBusinessName,
  preSelectedEntityId,
  preSelectedEntityType,
  preSelectedEntityName,
}: PremiumModalProps) {
  const colors = useThemedColors();
  const isBuyer = userRole === 'buyer';
  // Los datos de pago vienen de public.app_settings: nunca se hardcodean en el bundle
  const { data: payment, isConfigured: paymentConfigured } = usePaymentSettings();

  const {
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
  } = usePremiumModal({
    visible,
    onClose,
    onSuccess,
    onSubscribed,
    initialPlan,
    preSelectedBusinessId,
    preSelectedEntityId,
    preSelectedEntityType,
  });

  const handlePaymentUnavailable = useCallback(() => {
    Toast.show({
      type: 'info',
      text1: 'Pagos no disponibles',
      text2: 'Escríbenos a rutica.app@gmail.com para adquirir un plan',
      position: 'top',
    });
  }, []);

  // Renderizar el contenido según el paso actual
  const renderStepContent = () => {
    if (step === 'plans') {
      return (
        <PlansStep
          selectedPlans={isBuyer ? [] : selectedPlans}
          onSelectPlan={isBuyer ? () => {} : handleSelectPlan}
          isBuyer={isBuyer}
        />
      );
    }

    if (step === 'business') {
      return (
        <BusinessStep
          businessRequiredPlans={businessRequiredPlans}
          businessSelections={businessSelections}
          onSelectBusiness={handleSelectBusiness}
        />
      );
    }

    if (step === 'entity') {
      return (
        <EntityStep
          entityRequiredPlans={entityRequiredPlans}
          entitySelections={entitySelections}
          onSelectEntity={handleSelectEntity}
        />
      );
    }

    if (!paymentConfigured) {
      return (
        <View style={{ padding: 16 }}>
          <Text style={{ color: colors.text.primary, fontWeight: '600', marginBottom: 8 }}>
            Pagos no disponibles por el momento
          </Text>
          <Text style={{ color: colors.text.secondary }}>
            Estamos configurando los medios de pago. Escríbenos a rutica.app@gmail.com para
            adquirir un plan.
          </Text>
        </View>
      );
    }

    return (
      <PaymentStep
        selectedPlans={selectedPlans}
        businessSelections={businessSelections}
        entitySelections={entitySelections}
        preSelectedBusinessName={preSelectedBusinessName}
        preSelectedEntityName={preSelectedEntityName}
        paymentMethod={paymentMethod}
        paymentReference={paymentReference}
        paymentNote={paymentNote}
        error={error}
        sinpeNumber={payment?.sinpeNumber ?? ''}
        sinpeName={payment?.sinpeName ?? ''}
        ibanAccount={payment?.iban ?? ''}
        transferName={payment?.transferName ?? ''}
        onMethodChange={setPaymentMethod}
        onReferenceChange={setPaymentReference}
        onNoteChange={setPaymentNote}
      />
    );
  };

  return (
    <AccessibleModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.background.secondary }]}>
          <ModalHeader step={step} onClose={handleClose} />

          {!isBuyer && <StepIndicator currentStep={step} />}
          {isBuyer && <BuyerNotice />}

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderStepContent()}
          </ScrollView>

          {!isBuyer && (
            <ModalFooter
              step={step}
              selectedPlans={selectedPlans}
              businessSelections={businessSelections}
              businessRequiredPlans={businessRequiredPlans}
              entitySelections={entitySelections}
              entityRequiredPlans={entityRequiredPlans}
              isLoading={isLoading}
              onBack={handleBack}
              onContinue={handleContinue}
              onSubmit={paymentConfigured ? handleSubmit : handlePaymentUnavailable}
            />
          )}
        </View>
      </View>

      <ToastConfig />
    </AccessibleModal>
  );
});
