import { memo, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ConfirmDeleteDialogProps {
    visible: boolean;
    entityName: string;
    entityType: 'negocio' | 'evento' | 'atracción';
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting?: boolean;
}

export const ConfirmDeleteDialog = memo(function ConfirmDeleteDialog({
    visible,
    entityName,
    entityType,
    onConfirm,
    onCancel,
    isDeleting = false,
}: ConfirmDeleteDialogProps) {
    const colors = useThemedColors();
    const [confirmText, setConfirmText] = useState('');

    const isValid = confirmText === entityName;

    const handleConfirm = () => {
        if (isValid) {
            onConfirm();
        }
    };

    const handleClose = () => {
        setConfirmText('');
        onCancel();
    };

    const entityTypeLabels = {
        negocio: {
            title: 'Eliminar negocio',
            description: 'Se eliminará toda la información del negocio incluyendo imágenes y datos de contacto.',
            buttonText: 'Eliminar negocio',
            deletingText: 'Eliminando...',
        },
        evento: {
            title: 'Eliminar evento',
            description: 'Se eliminará toda la información del evento incluyendo imágenes, fechas y ubicación.',
            buttonText: 'Eliminar evento',
            deletingText: 'Eliminando...',
        },
        atracción: {
            title: 'Eliminar atracción',
            description: 'Se eliminará toda la información de la atracción incluyendo imágenes y ubicación.',
            buttonText: 'Eliminar atracción',
            deletingText: 'Eliminando...',
        },
    };

    const labels = entityTypeLabels[entityType];

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
                            {labels.title}
                        </Text>
                        <Text style={[styles.description, { color: colors.text.secondary }]}>
                            Esta acción es <Text style={[styles.bold, { color: colors.error }]}>permanente</Text> y no se puede deshacer. 
                            {labels.description}
                        </Text>

                        <View style={[styles.warningBox, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}>
                            <Text style={[styles.warningText, { color: colors.error }]}>
                                ⚠️ Esta acción no se puede revertir
                            </Text>
                        </View>

                        <Text style={[styles.label, { color: colors.text.primary }]}>
                            Para confirmar, escribe el nombre del {entityType}: <Text style={styles.bold}>{entityName}</Text>
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
                            placeholder={entityName}
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
                                {isDeleting ? labels.deletingText : labels.buttonText}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});
