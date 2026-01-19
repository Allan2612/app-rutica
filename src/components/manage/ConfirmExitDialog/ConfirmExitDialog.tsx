import { memo } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { AlertCircle, X, LogOut, ArrowLeft } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles, webStyles } from './styles';

interface ConfirmExitDialogProps {
    /** Si el modal está visible */
    visible: boolean;
    /** Callback cuando se confirma la salida */
    onConfirm: () => void;
    /** Callback cuando se cancela y se queda en el formulario */
    onCancel: () => void;
    /** Título personalizado del diálogo */
    title?: string;
    /** Descripción personalizada del diálogo */
    description?: string;
    /** Texto del botón de continuar editando */
    cancelLabel?: string;
    /** Texto del botón de salir */
    confirmLabel?: string;
}

/**
 * Componente modal para confirmar la salida de formularios con cambios sin guardar.
 * Funciona en web, iOS y Android.
 * 
 * @example
 * <ConfirmExitDialog
 *     visible={showExitDialog}
 *     onConfirm={() => router.back()}
 *     onCancel={() => setShowExitDialog(false)}
 * />
 */
export const ConfirmExitDialog = memo(function ConfirmExitDialog({
    visible,
    onConfirm,
    onCancel,
    title = 'Cambios sin guardar',
    description = 'Tienes cambios que no se han guardado. Si sales ahora, perderás todo el progreso realizado en este formulario.',
    cancelLabel = 'Continuar',
    confirmLabel = 'Salir',
}: ConfirmExitDialogProps) {
    const colors = useThemedColors();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View 
                    style={[
                        styles.dialog, 
                        { backgroundColor: colors.background.primary },
                        webStyles.dialog as object,
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View 
                            style={[
                                styles.iconWrapper, 
                                { backgroundColor: colors.warning + '20' }
                            ]}
                        >
                            <AlertCircle 
                                color={colors.warning} 
                                size={28} 
                                strokeWidth={2} 
                            />
                        </View>
                        <Pressable
                            style={[styles.closeButton, webStyles.closeButton as object]}
                            onPress={onCancel}
                            accessibilityLabel="Cerrar diálogo"
                            accessibilityRole="button"
                        >
                            <X color={colors.text.tertiary} size={24} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {title}
                        </Text>
                        <Text style={[styles.description, { color: colors.text.secondary }]}>
                            {description}
                        </Text>

                        <View 
                            style={[
                                styles.warningBox, 
                                { 
                                    backgroundColor: colors.warning + '10', 
                                    borderColor: colors.warning + '30',
                                }
                            ]}
                        >
                            <LogOut 
                                size={18} 
                                color={colors.warning} 
                                strokeWidth={2} 
                            />
                            <Text style={[styles.warningText, { color: colors.warning }]}>
                                Los cambios no guardados se perderán permanentemente
                            </Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                webStyles.button as object,
                                {
                                    backgroundColor: colors.background.tertiary,
                                    borderWidth: 1,
                                    borderColor: colors.border.medium,
                                    opacity: pressed ? 0.7 : 1,
                                },
                            ]}
                            onPress={onCancel}
                            accessibilityLabel={cancelLabel}
                            accessibilityRole="button"
                        >
                            <ArrowLeft 
                                color={colors.text.primary} 
                                size={18} 
                                strokeWidth={2} 
                            />
                            <Text style={[styles.buttonText, { color: colors.text.primary }]}>
                                {cancelLabel}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                webStyles.button as object,
                                {
                                    backgroundColor: colors.error,
                                    opacity: pressed ? 0.8 : 1,
                                },
                            ]}
                            onPress={onConfirm}
                            accessibilityLabel={confirmLabel}
                            accessibilityRole="button"
                        >
                            <LogOut 
                                color={colors.text.inverse} 
                                size={18} 
                                strokeWidth={2} 
                            />
                            <Text style={[styles.buttonText, { color: colors.text.inverse }]}>
                                {confirmLabel}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});
