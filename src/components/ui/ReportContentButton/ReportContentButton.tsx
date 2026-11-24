/**
 * ReportContentButton (4.9)
 * "Reportar" + diálogo con motivo y detalle opcional. No se muestra al dueño del contenido.
 * `compact` es solo el ícono, para tarjetas de reseña.
 */

import { memo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { Flag, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { useAuthStore } from '@/store';
import { spacing } from '@/styles/theme';
import {
  REPORT_REASONS,
  reportContent,
  type ReportEntityType,
  type ReportReason,
} from '@/services/contentReports.service';

interface ReportContentButtonProps {
  entityType: ReportEntityType;
  entityId: string;
  /** Dueño o autor del contenido: a esa persona no se le muestra el botón */
  ownerId?: string | null;
  compact?: boolean;
}

const MAX_DETAILS = 1000;

export const ReportContentButton = memo(function ReportContentButton({
  entityType,
  entityId,
  ownerId,
  compact = false,
}: ReportContentButtonProps) {
  const colors = useThemedColors();
  const userId = useAuthStore((s) => s.user?.id);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);

  if (userId && ownerId && userId === ownerId) return null;

  const handleOpen = () => {
    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Iniciar sesión',
        text2: 'Debes iniciar sesión para reportar contenido',
        position: 'top',
      });
      return;
    }
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setReason(null);
    setDetails('');
  };

  const handleSubmit = async () => {
    if (!reason) return;
    setSending(true);
    try {
      await reportContent({ entityType, entityId, reason, details });
      close();
      Toast.show({
        type: 'success',
        text1: 'Reporte enviado',
        text2: 'Gracias. Lo revisaremos pronto.',
        position: 'top',
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'No se envió el reporte',
        text2: (e as Error).message,
        position: 'top',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel="Reportar este contenido"
        hitSlop={8}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: compact ? 'auto' : 'center',
          gap: spacing.xs,
          paddingVertical: compact ? spacing.xs : spacing.md,
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Flag size={compact ? 14 : 16} color={colors.text.tertiary} />
        {!compact && (
          <Text style={{ color: colors.text.tertiary, fontSize: 13 }}>Reportar este contenido</Text>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable
          onPress={close}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.lg,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            accessibilityViewIsModal
            style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 16,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border.light,
              backgroundColor: colors.background.primary,
              gap: spacing.sm,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
                Reportar contenido
              </Text>
              <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
                hitSlop={8}
              >
                <X size={22} color={colors.text.tertiary} />
              </Pressable>
            </View>
            <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
              ¿Qué problema tiene? Un administrador lo revisará.
            </Text>

            <View accessibilityRole="radiogroup" style={{ gap: spacing.xs }}>
              {REPORT_REASONS.map((r) => {
                const selected = reason === r.value;
                return (
                  <Pressable
                    key={r.value}
                    onPress={() => setReason(r.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.sm,
                      padding: spacing.sm,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: selected ? colors.primary[500] : colors.border.light,
                    }}
                  >
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: selected ? colors.primary[500] : colors.border.medium,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selected && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: colors.primary[500],
                          }}
                        />
                      )}
                    </View>
                    <Text style={{ color: colors.text.primary, fontSize: 14 }}>{r.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              value={details}
              onChangeText={(t) => setDetails(t.slice(0, MAX_DETAILS))}
              placeholder="Detalles (opcional)"
              placeholderTextColor={colors.text.tertiary}
              accessibilityLabel="Detalles del reporte"
              multiline
              style={{
                minHeight: 80,
                borderWidth: 1,
                borderColor: colors.border.light,
                borderRadius: 10,
                padding: spacing.sm,
                color: colors.text.primary,
                textAlignVertical: 'top',
              }}
            />

            <Pressable
              onPress={handleSubmit}
              disabled={!reason || sending}
              accessibilityRole="button"
              accessibilityState={{ disabled: !reason || sending }}
              style={{
                marginTop: spacing.xs,
                paddingVertical: spacing.sm,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: reason ? colors.primary[500] : colors.border.medium,
              }}
            >
              {sending ? (
                <ActivityIndicator color={colors.text.inverse} />
              ) : (
                <Text style={{ color: colors.text.inverse, fontWeight: '600' }}>
                  Enviar reporte
                </Text>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
});
