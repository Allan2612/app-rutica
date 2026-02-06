import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { SubscriptionType } from '@/types/enums';
import { styles } from './styles';

interface ModalFooterProps {
    step: 'plans' | 'business' | 'payment';
    selectedPlans: SubscriptionType[];
    selectedBusinessId: string | null;
    requiresBusinessSelection: boolean;
    isLoading: boolean;
    onBack: () => void;
    onContinue: () => void;
    onSubmit: () => void;
}

export const ModalFooter = memo(function ModalFooter({
    step,
    selectedPlans,
    selectedBusinessId,
    requiresBusinessSelection,
    isLoading,
    onBack,
    onContinue,
    onSubmit,
}: ModalFooterProps) {
    const colors = useThemedColors();

    // Determinar si el botón continuar debe estar deshabilitado
    const isContinueDisabled =
        (step === 'plans' && selectedPlans.length === 0) ||
        (step === 'business' && !selectedBusinessId);

    // Determinar texto del botón secundario
    const getBackButtonText = () => {
        if (step === 'plans') return 'Cancelar';
        return 'Atrás';
    };

    // Determinar texto del botón principal
    const getContinueButtonText = () => {
        if (step === 'plans') return 'Continuar';
        if (step === 'business') return 'Continuar';
        return 'Pagar Premium';
    };

    // Determinar acción del botón principal
    const handlePrimaryAction = () => {
        if (step === 'payment') {
            onSubmit();
        } else {
            onContinue();
        }
    };

    return (
        <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
            <Pressable
                style={[
                    styles.backButton,
                    {
                        backgroundColor: colors.background.tertiary,
                        borderColor: colors.border.medium,
                    },
                ]}
                onPress={onBack}
            >
                <Text style={[styles.backButtonText, { color: colors.text.primary }]}>
                    {getBackButtonText()}
                </Text>
            </Pressable>

            <Pressable
                style={[
                    styles.continueButton,
                    { backgroundColor: colors.primary[500] },
                    isContinueDisabled && styles.continueButtonDisabled,
                ]}
                onPress={handlePrimaryAction}
                disabled={isLoading || isContinueDisabled}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.continueButtonText}>
                        {getContinueButtonText()}
                    </Text>
                )}
            </Pressable>
        </View>
    );
});
