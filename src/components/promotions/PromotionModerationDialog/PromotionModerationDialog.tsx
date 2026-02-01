import { memo, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Modal, ActivityIndicator, ScrollView, Switch } from 'react-native';
import { Check, X, AlertTriangle, CreditCard, Eye, EyeOff, MessageSquare } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { ModerationStatus } from '@/types/enums';
// @ts-ignore - Styles file exists
import { styles } from './styles';

export interface PromotionModerationDialogProps {
  visible: boolean;
  promotionName: string;
  currentModerationStatus?: ModerationStatus;
  currentModerationNote?: string | null;
  currentPaymentState?: 'pending' | 'paid' | 'rejected';
  currentPaymentNote?: string | null;
  currentIsActive?: boolean;
  onConfirm: (data: {
    moderationStatus?: ModerationStatus;
    moderationNote?: string;
    paymentState?: 'pending' | 'paid' | 'rejected';
    paymentNote?: string;
    isActive?: boolean;
  }) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const PromotionModerationDialog = memo(function PromotionModerationDialog({
  visible,
  promotionName,
  currentModerationStatus = 'pending',
  currentModerationNote,
  currentPaymentState = 'pending',
  currentPaymentNote,
  currentIsActive = true,
  onConfirm,
  onCancel,
  isProcessing = false,
}: PromotionModerationDialogProps) {
  const colors = useThemedColors();
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [paymentState, setPaymentState] = useState<'pending' | 'paid' | 'rejected' | null>(null);
  const [paymentNote, setPaymentNote] = useState('');
  const [isActive, setIsActive] = useState<boolean | null>(null);

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

    if (isActive !== null) {
      data.isActive = isActive;
    }
    
    onConfirm(data);
    
    // Reset state
    setModerationStatus(null);
    setModerationNote('');
    setPaymentState(null);
    setPaymentNote('');
    setIsActive(null);
  }, [moderationStatus, moderationNote, paymentState, paymentNote, isActive, onConfirm]);

  const handleCancel = useCallback(() => {
    setModerationStatus(null);
    setModerationNote('');
    setPaymentState(null);
    setPaymentNote('');
    setIsActive(null);
    onCancel();
  }, [onCancel]);

  const canConfirm = moderationStatus !== null || paymentState !== null || isActive !== null;

  // Visibility toggle state
  const activeChanged = isActive !== null && isActive !== currentIsActive;
  const effectiveIsActive = isActive !== null ? isActive : currentIsActive;

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

            {/* Visibility Toggle Section */}
            <View style={[styles.section, { backgroundColor: colors.background.secondary, borderRadius: 12, padding: 16, marginBottom: 16 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                {effectiveIsActive ? (
                  <Eye size={20} color={colors.success} />
                ) : (
                  <EyeOff size={20} color={colors.error} />
                )}
                <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: 0 }]}>
                  Visibilidad
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: 2 }}>
                    {effectiveIsActive ? 'Activa (Visible)' : 'Inactiva (Oculta)'}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                    {effectiveIsActive
                      ? 'La promoción es visible para los usuarios'
                      : 'La promoción está oculta para los usuarios'}
                  </Text>
                </View>
                <Switch
                  value={effectiveIsActive}
                  onValueChange={(value) => setIsActive(value)}
                  trackColor={{ false: colors.background.tertiary, true: colors.success }}
                  thumbColor={effectiveIsActive ? '#fff' : colors.text.tertiary}
                />
              </View>

              {activeChanged && (
                <View style={{ marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.warning, alignSelf: 'flex-start' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>
                    Cambio pendiente: {isActive ? 'Activar' : 'Desactivar'}
                  </Text>
                </View>
              )}
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

              {/* Show existing moderation note */}
              {currentModerationNote && (
                <View style={{ padding: 12, borderRadius: 8, backgroundColor: colors.background.tertiary, marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <MessageSquare size={14} color={colors.warning} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text.secondary }}>
                      Nota anterior:
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, lineHeight: 18, fontStyle: 'italic', color: colors.text.primary }}>
                    {currentModerationNote}
                  </Text>
                </View>
              )}

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

              {/* Show existing payment note */}
              {currentPaymentNote && (
                <View style={{ padding: 12, borderRadius: 8, backgroundColor: colors.background.tertiary, marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <MessageSquare size={14} color={colors.primary[500]} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text.secondary }}>
                      Nota de pago anterior:
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, lineHeight: 18, fontStyle: 'italic', color: colors.text.primary }}>
                    {currentPaymentNote}
                  </Text>
                </View>
              )}

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
