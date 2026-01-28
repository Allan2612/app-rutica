import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';

interface ModalButtonsProps {
    isEditMode: boolean;
    isLoading: boolean;
    isSubmitDisabled: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

export const ModalButtons = memo(function ModalButtons({
    isEditMode,
    isLoading,
    isSubmitDisabled,
    onCancel,
    onSubmit,
}: ModalButtonsProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.buttons}>
            <Pressable
                style={[styles.button, styles.cancelButton, {
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.medium,
                }]}
                onPress={onCancel}
                disabled={isLoading}
            >
                <Text style={[styles.buttonText, { color: colors.text.primary }]}>
                    Cancelar
                </Text>
            </Pressable>

            <Pressable
                style={[styles.button, styles.submitButton, {
                    backgroundColor: colors.primary[500],
                    opacity: isSubmitDisabled || isLoading ? 0.5 : 1,
                }]}
                onPress={onSubmit}
                disabled={isSubmitDisabled || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={[styles.buttonText, { color: '#fff' }]}>
                        {isEditMode ? 'Guardar cambios' : 'Publicar reseña'}
                    </Text>
                )}
            </Pressable>
        </View>
    );
});
