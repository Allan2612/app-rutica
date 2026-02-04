import { memo } from 'react';
import { View, ScrollView } from 'react-native';
import { AccessibleModal } from '@/components/ui';
import { useThemedColors } from '@/hooks';
import type { UserRole } from '@/types/enums';
import { StepIndicator } from './StepIndicator';
import { PlansStep } from './PlansStep';
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
    userRole: UserRole | null;
}

// Configuración de pago
const SINPE_NUMBER = '8888-8888';
const SINPE_NAME = 'Rutica CR';
const IBAN_ACCOUNT = 'CR12345678901234567890';
const TRANSFER_NAME = 'Rutica S.A';

export const PremiumModal = memo(function PremiumModal({
    visible,
    onClose,
    onSuccess,
    onInfo,
    userRole,
}: PremiumModalProps) {
    const colors = useThemedColors();
    const isBuyer = userRole === 'buyer';

    const {
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
    } = usePremiumModal({ onClose, onSuccess });

    return (
        <AccessibleModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.modalContainer,
                        { backgroundColor: colors.background.secondary },
                    ]}
                >
                    <ModalHeader step={step} onClose={handleClose} />

                    {!isBuyer && <StepIndicator currentStep={step} />}
                    {isBuyer && <BuyerNotice />}

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {step === 'plans' ? (
                            <PlansStep
                                selectedPlans={isBuyer ? [] : selectedPlans}
                                onSelectPlan={isBuyer ? () => { } : handleSelectPlan}
                                isBuyer={isBuyer}
                            />
                        ) : (
                            <PaymentStep
                                selectedPlans={selectedPlans}
                                paymentMethod={paymentMethod}
                                paymentReference={paymentReference}
                                paymentNote={paymentNote}
                                error={error}
                                sinpeNumber={SINPE_NUMBER}
                                sinpeName={SINPE_NAME}
                                ibanAccount={IBAN_ACCOUNT}
                                transferName={TRANSFER_NAME}
                                onMethodChange={setPaymentMethod}
                                onReferenceChange={setPaymentReference}
                                onNoteChange={setPaymentNote}
                            />
                        )}
                    </ScrollView>

                    {!isBuyer && (
                        <ModalFooter
                            step={step}
                            selectedPlans={selectedPlans}
                            isLoading={isLoading}
                            onBack={handleBack}
                            onContinue={handleContinue}
                            onSubmit={handleSubmit}
                        />
                    )}
                </View>
            </View>

            <ToastConfig />
        </AccessibleModal>
    );
});
