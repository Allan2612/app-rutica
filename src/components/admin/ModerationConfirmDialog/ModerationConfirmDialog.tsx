import { memo, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Check, X, AlertTriangle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { ModerationStatus } from '@/types/enums';
import { styles } from './styles';

export interface ModerationConfirmDialogProps {
  visible: boolean;
  entityId: string;
  isPromotion?: boolean;
  currentModerationStatus?: ModerationStatus;
  currentPaymentState?: 'pending' | 'paid' | 'rejected';
  onConfirm: (data: {
    moderationStatus?: ModerationStatus;
    moderationNote?: string;
    paymentState?: 'pending' | 'paid' | 'rejected';
    paymentNote?: string;
  }) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const ModerationConfirmDialog = memo(function ModerationConfirmDialog({
  visible,
  entityId,
  isPromotion = false,
  currentModerationStatus = 'pending',
  currentPaymentState = 'pending',
  onConfirm,
  onCancel,
  isProcessing = false,
}: ModerationConfirmDialogProps) {
  const colors = useThemedColors();
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  const handleConfirm = useCallback(() => {
    const data: any = {};
    
    if (moderationStatus) {
      data.moderationStatus = moderationStatus;
      if (moderationNote.trim()) {
        data.moderationNote = moderationNote;
      }
    }
    
    onConfirm(data);
    
    // Reset state
    setModerationStatus(null);
    setModerationNote('');
  }, [moderationStatus, moderationNote, onConfirm]);

  const handleCancel = useCallback(() => {
    setModerationStatus(null);
    setModerationNote('');
    onCancel();
  }, [onCancel]);

  const canConfirm = moderationStatus !== null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <AlertTriangle size={24} color={colors.warning} />
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Cambiar Estado de Moderación
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Moderation Status Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Estado de Moderación
              </Text>
              <Text style={[styles.currentStatus, { color: colors.text.secondary }]}>
                Actual:{' '}
                <Text style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                  {currentModerationStatus === 'pending' ? 'Pendiente' : currentModerationStatus === 'approved' ? 'Aprobado' : 'Rechazado'}
                </Text>
              </Text>

              <View style={styles.buttonGroup}>
                <Pressable
                  style={({ pressed }) => [
                    styles.statusButton,
                    moderationStatus === 'approved' && styles.statusButtonActive,
                    {
                      backgroundColor: moderationStatus === 'approved'
                        ? colors.success
                        : pressed
                        ? colors.background.tertiary
                        : colors.background.secondary,
                      borderColor: moderationStatus === 'approved' ? colors.success : colors.border.light,
                    },
                  ]}
                  onPress={() =>
                    setModerationStatus(moderationStatus === 'approved' ? null : 'approved')
                  }
                >
                  <Check
                    size={18}
                    color={moderationStatus === 'approved' ? '#fff' : colors.success}
                  />
                  <Text
                    style={[
                      styles.statusButtonText,
                      { color: moderationStatus === 'approved' ? '#fff' : colors.text.primary },
                    ]}
                  >
                    Aprobar
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.statusButton,
                    moderationStatus === 'rejected' && styles.statusButtonActive,
                    {
                      backgroundColor: moderationStatus === 'rejected'
                        ? colors.error
                        : pressed
                        ? colors.background.tertiary
                        : colors.background.secondary,
                      borderColor: moderationStatus === 'rejected' ? colors.error : colors.border.light,
                    },
                  ]}
                  onPress={() =>
                    setModerationStatus(moderationStatus === 'rejected' ? null : 'rejected')
                  }
                >
                  <X
                    size={18}
                    color={moderationStatus === 'rejected' ? '#fff' : colors.error}
                  />
                  <Text
                    style={[
                      styles.statusButtonText,
                      { color: moderationStatus === 'rejected' ? '#fff' : colors.text.primary },
                    ]}
                  >
                    Rechazar
                  </Text>
                </Pressable>
              </View>

              {moderationStatus && (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                    },
                  ]}
                  placeholder="Nota de moderación (opcional)"
                  placeholderTextColor={colors.text.secondary}
                  value={moderationNote}
                  onChangeText={setModerationNote}
                  multiline
                  numberOfLines={3}
                />
              )}
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  backgroundColor: pressed
                    ? colors.background.tertiary
                    : colors.background.secondary,
                },
              ]}
              onPress={handleCancel}
              disabled={isProcessing}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text.primary }]}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                {
                  backgroundColor: !canConfirm || isProcessing
                    ? colors.background.tertiary
                    : pressed
                    ? colors.primary[600]
                    : colors.primary[500],
                  opacity: !canConfirm || isProcessing ? 0.5 : 1,
                },
              ]}
              onPress={handleConfirm}
              disabled={!canConfirm || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});
