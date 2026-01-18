import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface FormActionsProps {
    onCancel: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    submitLabel?: string;
    hasChanges?: boolean;
}

export const FormActions = memo(function FormActions({
    onCancel,
    onSubmit,
    isSubmitting,
    submitLabel = 'Guardar',
    hasChanges = false,
}: FormActionsProps) {
    const colors = useThemedColors();

    const handleCancel = () => {
        if (hasChanges) {
            Alert.alert(
                'Cambios sin guardar',
                '¿Estás seguro de que deseas salir? Los cambios no se guardarán.',
                [
                    { text: 'Continuar editando', style: 'cancel' },
                    { text: 'Salir sin guardar', style: 'destructive', onPress: onCancel },
                ],
                { cancelable: true }
            );
        } else {
            onCancel();
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: colors.background.tertiary,
                        opacity: pressed || isSubmitting ? 0.5 : 1,
                    },
                ]}
                onPress={handleCancel}
                disabled={isSubmitting}
            >
                <X color={colors.text.primary} size={20} strokeWidth={2} />
                <Text style={[styles.buttonText, { color: colors.text.primary }]}>Cancelar</Text>
            </Pressable>

            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    {
                        backgroundColor: colors.primary[500],
                        opacity: pressed || isSubmitting ? 0.7 : 1,
                    },
                ]}
                onPress={onSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.text.inverse} />
                ) : (
                    <>
                        <Check color={colors.text.inverse} size={20} strokeWidth={2.5} />
                        <Text style={[styles.buttonText, { color: colors.text.inverse }]}>{submitLabel}</Text>
                    </>
                )}
            </Pressable>
        </View>
    );
});
