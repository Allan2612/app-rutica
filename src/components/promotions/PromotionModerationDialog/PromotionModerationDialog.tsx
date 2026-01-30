import { memo, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { Check, X, AlertTriangle, CreditCard } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { ModerationStatus } from '@/types/enums';
// @ts-ignore - Styles file exists
import { styles } from './styles';

export interface PromotionModerationDialogProps {
  visible: boolean;
  promotionName: string;
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

export const PromotionModerationDialog = memo(function PromotionModerationDialog({
  visible,
  promotionName,
  currentModerationStatus = 'pending',
  currentPaymentState = 'pending',
  onConfirm,
  onCancel,
  isProcessing = false,
}: PromotionModerationDialogProps) {
  const colors = useThemedColors();
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [paymentState, setPaymentState] = useState<'pending' | 'paid' | 'rejected' | null>(null);
  const [paymentNote, setPaymentNote] = useState('');

  const handleConfirm = useCallback(() => {
    const data: any = {};
    
    if (moderationStatus) {
      data.moderationStatus = moderationStatus;
      if (moderationNote.trim()) {
        data.moderationNote = moderationNote;
      }
    }
    
    if (paymentState) {
      data.paymentState = paymentState;
      if (paymentNote.trim()) {
        data.paymentNote = paymentNote;
      }
    }
    
    onConfirm(data);
    
    // Reset state
    setModerationStatus(null);
    setModerationNote('');
    setPaymentState(null);
    setPaymentNote('');
  }, [moderationStatus, moderationNote, paymentState, paymentNote, onConfirm]);

  const handleCancel = useCallback(() => {
    setModerationStatus(null);
    setModerationNote('');
    setPaymentState(null);
    setPaymentNote('');
    onCancel();
  }, [onCancel]);

  const canConfirm = moderationStatus !== null || paymentState !== null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <AlertTriangle size={24} color={colors.warning} />
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Gestionar Promoción
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Promotion Info */}
            <View style={[styles.promoHeader, { backgroundColor: colors.background.secondary }]}>
              <Text style={[styles.promoName, { color: colors.text.primary }]}>
                {promotionName}
              </Text>
              <Text style={[styles.promoType, { color: colors.text.secondary }]}>
                Promoción
              </Text>
            </View>

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

            {/* Payment Status Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CreditCard size={18} color={colors.primary[500]} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: 0 }]}>
                  Estado de Pago
                </Text>
              </View>
              <Text style={[styles.currentStatus, { color: colors.text.secondary }]}>
                Actual:{' '}
                <Text style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                  {currentPaymentState === 'pending' ? 'Pendiente' : currentPaymentState === 'paid' ? 'Pagado' : 'Rechazado'}
                </Text>
              </Text>

              <View style={styles.buttonGroup}>
                <Pressable
                  style={({ pressed }) => [
                    styles.statusButton,
                    paymentState === 'paid' && styles.statusButtonActive,
                    {
                      backgroundColor: paymentState === 'paid'
                        ? colors.success
                        : pressed
                        ? colors.background.tertiary
                        : colors.background.secondary,
                      borderColor: paymentState === 'paid' ? colors.success : colors.border.light,
                    },
                  ]}
                  onPress={() => setPaymentState(paymentState === 'paid' ? null : 'paid')}
                >
                  <Check size={18} color={paymentState === 'paid' ? '#fff' : colors.success} />
                  <Text
                    style={[
                      styles.statusButtonText,
                      { color: paymentState === 'paid' ? '#fff' : colors.text.primary },
                    ]}
                  >
                    Pagado
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.statusButton,
                    paymentState === 'rejected' && styles.statusButtonActive,
                    {
                      backgroundColor: paymentState === 'rejected'
                        ? colors.error
                        : pressed
                        ? colors.background.tertiary
                        : colors.background.secondary,
                      borderColor: paymentState === 'rejected' ? colors.error : colors.border.light,
                    },
                  ]}
                  onPress={() => setPaymentState(paymentState === 'rejected' ? null : 'rejected')}
                >
                  <X size={18} color={paymentState === 'rejected' ? '#fff' : colors.error} />
                  <Text
                    style={[
                      styles.statusButtonText,
                      { color: paymentState === 'rejected' ? '#fff' : colors.text.primary },
                    ]}
                  >
                    Rechazar
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.statusButton,
                    paymentState === 'pending' && styles.statusButtonActive,
                    {
                      backgroundColor: paymentState === 'pending'
                        ? colors.warning
                        : pressed
                        ? colors.background.tertiary
                        : colors.background.secondary,
                      borderColor: paymentState === 'pending' ? colors.warning : colors.border.light,
                    },
                  ]}
                  onPress={() => setPaymentState(paymentState === 'pending' ? null : 'pending')}
                >
                  <AlertTriangle
                    size={18}
                    color={paymentState === 'pending' ? '#fff' : colors.warning}
                  />
                  <Text
                    style={[
                      styles.statusButtonText,
                      { color: paymentState === 'pending' ? '#fff' : colors.text.primary },
                    ]}
                  >
                    Pendiente
                  </Text>
                </Pressable>
              </View>

              {paymentState && (
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                    },
                  ]}
                  placeholder="Nota del pago (opcional)"
                  placeholderTextColor={colors.text.secondary}
                  value={paymentNote}
                  onChangeText={setPaymentNote}
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
                  backgroundColor: !canConfirm
                    ? colors.text.tertiary
                    : pressed
                    ? colors.primary[600]
                    : colors.primary[500],
                  opacity: !canConfirm ? 0.5 : 1,
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
