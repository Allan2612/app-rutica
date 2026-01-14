import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface FormActionsProps {
    onCancel: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    submitLabel?: string;
}

export const FormActions = memo(function FormActions({
    onCancel,
    onSubmit,
    isSubmitting,
    submitLabel = 'Guardar',
}: FormActionsProps) {
    const colors = useThemedColors();

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
                onPress={onCancel}
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
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Check color="#fff" size={20} strokeWidth={2.5} />
                        <Text style={[styles.buttonText, { color: '#fff' }]}>{submitLabel}</Text>
                    </>
                )}
            </Pressable>
        </View>
    );
});
