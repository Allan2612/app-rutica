import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { SubscriptionType } from '@/types/enums';
import { styles } from './styles';

interface ModalFooterProps {
    step: 'plans' | 'payment';
    selectedPlans: SubscriptionType[];
    isLoading: boolean;
    onBack: () => void;
    onContinue: () => void;
    onSubmit: () => void;
}

export const ModalFooter = memo(function ModalFooter({
    step,
    selectedPlans,
    isLoading,
    onBack,
    onContinue,
    onSubmit,
}: ModalFooterProps) {
    const colors = useThemedColors();

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
                    {step === 'plans' ? 'Cancelar' : 'Atrás'}
                </Text>
            </Pressable>

            <Pressable
                style={[
                    styles.continueButton,
                    { backgroundColor: colors.primary[500] },
                    (step === 'plans' && selectedPlans.length === 0) && styles.continueButtonDisabled,
                ]}
                onPress={step === 'plans' ? onContinue : onSubmit}
                disabled={isLoading || (step === 'plans' && selectedPlans.length === 0)}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <Text style={styles.continueButtonText}>
                        {step === 'plans' ? 'Continuar' : 'Pagar Premium'}
                    </Text>
                )}
            </Pressable>
        </View>
    );
});
