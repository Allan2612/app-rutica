// ============================================
// Moderation Confirm Dialog - Enhanced Version
// Supports moderation status + is_active toggle
// ============================================

import { memo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import { Check, X, AlertTriangle, Eye, EyeOff, MessageSquare } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { STATUS_LABELS } from '@/features/admin/types';
import type { ModerationStatus } from '@/types/enums';
import { styles } from './styles';

export interface ModerationConfirmDialogProps {
  visible: boolean;
  entityName: string;
  entityType: 'business' | 'event' | 'attraction' | 'promotion';
  currentModerationStatus?: ModerationStatus;
  currentModerationNote?: string | null;
  currentIsActive?: boolean;
  onConfirm: (data: {
    moderationStatus?: ModerationStatus;
    moderationNote?: string;
    isActive?: boolean;
  }) => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const ModerationConfirmDialog = memo(function ModerationConfirmDialog({
  visible,
  entityName,
  entityType,
  currentModerationStatus = 'pending',
  currentModerationNote,
  currentIsActive = true,
  onConfirm,
  onCancel,
  isProcessing = false,
}: ModerationConfirmDialogProps) {
  const colors = useThemedColors();

  // State
  const [moderationStatus, setModerationStatus] = useState<ModerationStatus | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [isActive, setIsActive] = useState<boolean | null>(null);

  const handleConfirm = useCallback(() => {
    const data: any = {};

    if (moderationStatus) {
      data.moderationStatus = moderationStatus;
      if (moderationNote.trim()) {
        data.moderationNote = moderationNote;
      }
    }

    if (isActive !== null) {
      data.isActive = isActive;
    }

    onConfirm(data);

    // Reset state
    setModerationStatus(null);
    setModerationNote('');
    setIsActive(null);
  }, [moderationStatus, moderationNote, isActive, onConfirm]);

  const handleCancel = useCallback(() => {
    setModerationStatus(null);
    setModerationNote('');
    setIsActive(null);
    onCancel();
  }, [onCancel]);

  // Can confirm if either moderation status or active status changed
  const canConfirm = moderationStatus !== null || isActive !== null;

  // Determine if active toggle should show a change
  const activeChanged = isActive !== null && isActive !== currentIsActive;
  const effectiveIsActive = isActive !== null ? isActive : currentIsActive;

  // Get entity type label
  const entityTypeLabels = {
    business: 'Negocio',
    event: 'Evento',
    attraction: 'Atracción',
    promotion: 'Promoción',
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <AlertTriangle size={24} color={colors.warning} />
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Gestionar {entityTypeLabels[entityType]}
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Entity Info Header */}
            <View style={[styles.entityHeader, { backgroundColor: colors.background.secondary }]}>
              <Text style={[styles.entityName, { color: colors.text.primary }]}>{entityName}</Text>
              <Text style={[styles.entityType, { color: colors.text.secondary }]}>
                {entityTypeLabels[entityType]}
              </Text>
            </View>

            {/* Visibility Toggle Section */}
            <View
              style={[
                styles.section,
                {
                  backgroundColor: colors.background.secondary,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                },
              ]}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}
              >
                {effectiveIsActive ? (
                  <Eye size={20} color={colors.success} />
                ) : (
                  <EyeOff size={20} color={colors.error} />
                )}
                <Text
                  style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: 0 }]}
                >
                  Visibilidad
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text.primary,
                      marginBottom: 2,
                    }}
                  >
                    {effectiveIsActive ? 'Activo (Visible)' : 'Inactivo (Oculto)'}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                    {effectiveIsActive
                      ? 'El contenido es visible para los usuarios'
                      : 'El contenido está oculto para los usuarios'}
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
                <View
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    backgroundColor: colors.warning,
                    alignSelf: 'flex-start',
                  }}
                >
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
                  {STATUS_LABELS[currentModerationStatus]}
                </Text>
              </Text>

              {/* Show existing moderation note */}
              {currentModerationNote && (
                <View
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: colors.background.tertiary,
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}
                  >
                    <MessageSquare size={14} color={colors.warning} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text.secondary }}>
                      Nota anterior:
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      lineHeight: 18,
                      fontStyle: 'italic',
                      color: colors.text.primary,
                    }}
                  >
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
                      backgroundColor:
                        moderationStatus === 'approved'
                          ? colors.success
                          : pressed
                            ? colors.background.tertiary
                            : colors.background.secondary,
                      borderColor:
                        moderationStatus === 'approved' ? colors.success : colors.border.light,
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
                      backgroundColor:
                        moderationStatus === 'rejected'
                          ? colors.error
                          : pressed
                            ? colors.background.tertiary
                            : colors.background.secondary,
                      borderColor:
                        moderationStatus === 'rejected' ? colors.error : colors.border.light,
                    },
                  ]}
                  onPress={() =>
                    setModerationStatus(moderationStatus === 'rejected' ? null : 'rejected')
                  }
                >
                  <X size={18} color={moderationStatus === 'rejected' ? '#fff' : colors.error} />
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
                      backgroundColor: colors.background.primary,
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
                  backgroundColor:
                    !canConfirm || isProcessing
                      ? colors.background.tertiary
                      : pressed
                        ? colors.primary[600]
                        : colors.primary[500],
                },
              ]}
              onPress={handleConfirm}
              disabled={!canConfirm || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color={colors.text.inverse} />
              ) : (
                <Text
                  style={[
                    styles.confirmButtonText,
                    { color: canConfirm ? colors.text.inverse : colors.text.tertiary },
                  ]}
                >
                  Confirmar
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});
