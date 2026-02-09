import { memo } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface DeleteReviewDialogProps {
  visible: boolean;
  authorName: string;
  contentTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteReviewDialog = memo(function DeleteReviewDialog({
  visible,
  authorName,
  contentTitle,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteReviewDialogProps) {
  const colors = useThemedColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <AlertTriangle size={24} color={colors.error} />
            <Text style={[styles.title, { color: colors.text.primary }]}>Eliminar reseña</Text>
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
              ¿Estás seguro de que deseas eliminar esta reseña?
            </Text>

            <View style={[styles.infoBox, { backgroundColor: colors.background.secondary }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Autor:</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>{authorName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Contenido:</Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {contentTitle}
                </Text>
              </View>
            </View>

            <Text style={[styles.warning, { color: colors.error }]}>
              Esta acción no se puede deshacer.
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
                  backgroundColor: colors.background.tertiary,
                  opacity: pressed || isDeleting ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.text.primary }]}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isDeleting}
              style={({ pressed }) => [
                styles.button,
                styles.deleteButton,
                {
                  backgroundColor: colors.error,
                  opacity: pressed || isDeleting ? 0.8 : 1,
                },
              ]}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Eliminar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});
