import { memo } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import { AlertTriangle, X, Trash2 } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface DeleteProductDialogProps {
    visible: boolean;
    productName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export const DeleteProductDialog = memo(function DeleteProductDialog({
    visible,
    productName,
    onConfirm,
    onCancel,
    isDeleting = false,
}: DeleteProductDialogProps) {
    const colors = useThemedColors();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <View style={[styles.overlay, { backgroundColor: colors.overlay.dark }]}>
                <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                        <AlertTriangle size={24} color={colors.error} />
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            Eliminar producto
                        </Text>
                        {!isDeleting && (
                            <Pressable
                                onPress={onCancel}
                                style={({ pressed }) => ({
                                    opacity: pressed ? 0.7 : 1,
                                })}
                            >
                                <X size={24} color={colors.text.tertiary} />
                            </Pressable>
                        )}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={[styles.message, { color: colors.text.primary }]}>
                            ¿Estás seguro de que deseas eliminar este producto?
                        </Text>

                        <View style={[styles.infoBox, { backgroundColor: colors.background.secondary }]}>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.text.tertiary }]}>
                                    PRODUCTO:
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.text.primary }]} numberOfLines={2}>
                                    {productName}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.warning, { color: colors.error }]}>
                            Esta acción eliminará el producto y todas sus imágenes. No se puede deshacer.
                        </Text>
                    </View>

                    {/* Actions */}
                    <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
                        <Pressable
                            onPress={onCancel}
                            disabled={isDeleting}
                            style={({ pressed }) => [
                                styles.button,
                                styles.cancelButton,
                                {
                                    backgroundColor: colors.background.secondary,
                                    borderWidth: 1,
                                    borderColor: colors.border.medium,
                                    opacity: pressed || isDeleting ? 0.7 : 1,
                                },
                            ]}
                        >
                            <Text style={[styles.buttonText, { color: colors.text.primary }]}>
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={onConfirm}
                            disabled={isDeleting}
                            style={({ pressed }) => [
                                styles.button,
                                styles.deleteButton,
                                {
                                    backgroundColor: colors.error + '15',
                                    borderWidth: 1,
                                    borderColor: colors.error,
                                    opacity: pressed || isDeleting ? 0.7 : 1,
                                },
                            ]}
                        >
                            {isDeleting ? (
                                <ActivityIndicator size="small" color={colors.error} />
                            ) : (
                                <>
                                    <Text style={[styles.buttonText, { color: colors.error }]}>Eliminar</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});
