import { memo, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface DeleteEventDialogProps {
    visible: boolean;
    eventName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export const DeleteEventDialog = memo(function DeleteEventDialog({
    visible,
    eventName,
    onConfirm,
    onCancel,
    isDeleting = false,
}: DeleteEventDialogProps) {
    const colors = useThemedColors();
    const [confirmText, setConfirmText] = useState('');

    const isValid = confirmText === eventName;

    const handleConfirm = () => {
        if (isValid) {
            onConfirm();
        }
    };

    const handleClose = () => {
        setConfirmText('');
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[styles.iconWrapper, { backgroundColor: colors.error + '20' }]}>
                            <AlertTriangle color={colors.error} size={28} strokeWidth={2} />
                        </View>
                        <Pressable
                            style={styles.closeButton}
                            onPress={handleClose}
                            disabled={isDeleting}
                        >
                            <X color={colors.text.tertiary} size={24} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            Eliminar evento
                        </Text>
                        <Text style={[styles.description, { color: colors.text.secondary }]}>
                            Esta acción es <Text style={[styles.bold, { color: colors.error }]}>permanente</Text> y no se puede deshacer. 
                            Se eliminará toda la información del evento incluyendo imágenes, fechas y ubicación.
                        </Text>

                        <View style={[styles.warningBox, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}>
                            <Text style={[styles.warningText, { color: colors.error }]}>
                                ⚠️ Esta acción no se puede revertir
                            </Text>
                        </View>

                        <Text style={[styles.label, { color: colors.text.primary }]}>
                            Para confirmar, escribe el nombre del evento: <Text style={styles.bold}>{eventName}</Text>
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.medium,
                                    color: colors.text.primary,
                                },
                            ]}
                            value={confirmText}
                            onChangeText={setConfirmText}
                            placeholder={eventName}
                            placeholderTextColor={colors.text.tertiary}
                            editable={!isDeleting}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.cancelButton,
                                {
                                    backgroundColor: colors.background.tertiary,
                                    opacity: pressed || isDeleting ? 0.5 : 1,
                                },
                            ]}
                            onPress={handleClose}
                            disabled={isDeleting}
                        >
                            <Text style={[styles.buttonText, { color: colors.text.primary }]}>
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.deleteButton,
                                {
                                    backgroundColor: colors.error,
                                    opacity: pressed || !isValid || isDeleting ? 0.5 : 1,
                                },
                            ]}
                            onPress={handleConfirm}
                            disabled={!isValid || isDeleting}
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>
                                {isDeleting ? 'Eliminando...' : 'Eliminar evento'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});
