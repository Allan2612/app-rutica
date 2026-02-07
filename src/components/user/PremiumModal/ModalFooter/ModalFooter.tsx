import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { SubscriptionType } from '@/types/enums';
import type { EntitySelections, BusinessSelections } from '../usePremiumModal';
import { styles } from './styles';

interface ModalFooterProps {
    step: 'plans' | 'business' | 'entity' | 'payment';
    selectedPlans: SubscriptionType[];
    businessSelections: BusinessSelections;
    businessRequiredPlans: SubscriptionType[];
    entitySelections: EntitySelections;
    entityRequiredPlans: SubscriptionType[];
    isLoading: boolean;
    onBack: () => void;
    onContinue: () => void;
    onSubmit: () => void;
}

export const ModalFooter = memo(function ModalFooter({
    step,
    selectedPlans,
    businessSelections,
    businessRequiredPlans,
    entitySelections,
    entityRequiredPlans,
    isLoading,
    onBack,
    onContinue,
    onSubmit,
}: ModalFooterProps) {
    const colors = useThemedColors();

    // Verificar si todos los negocios requeridos están seleccionados
    const allBusinessesSelected = businessRequiredPlans.every(plan => !!businessSelections[plan]);

    // Verificar si todas las entidades requeridas están seleccionadas
    const allEntitiesSelected = entityRequiredPlans.every(plan => !!entitySelections[plan]);

    // Determinar si el botón continuar debe estar deshabilitado
    const isContinueDisabled =
        (step === 'plans' && selectedPlans.length === 0) ||
        (step === 'business' && !allBusinessesSelected) ||
        (step === 'entity' && !allEntitiesSelected);

    // Determinar texto del botón secundario
    const getBackButtonText = () => {
        if (step === 'plans') return 'Cancelar';
        return 'Atrás';
    };

    // Determinar texto del botón principal
    const getContinueButtonText = () => {
        if (step === 'plans') return 'Continuar';
        if (step === 'business') return 'Continuar';
        if (step === 'entity') return 'Continuar';
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
