import { memo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useThemedColors, useRefreshOnFocus } from '@/hooks';
import { BackButton, TabSelector, type TabOption } from '@/components/ui';
import { spacing } from '@/styles/theme';
import { formatDate, DATE_FORMAT_OPTIONS } from '@/utils';
import {
  getContentReports,
  setContentReportStatus,
  REPORT_ENTITY_LABELS,
  REPORT_REASONS,
  type ContentReport,
  type ReportStatus,
} from '@/services/contentReports.service';
import { styles } from '../AdminSubscriptionsScreen/styles';

const TABS: TabOption[] = [
  { id: 'open', label: 'Abiertos' },
  { id: 'actioned', label: 'Resueltos' },
  { id: 'dismissed', label: 'Descartados' },
];

const REASON_LABEL = Object.fromEntries(REPORT_REASONS.map((r) => [r.value, r.label]));

/**
 * Reportes de contenido (4.9). "Resuelto" = el admin ya moderó el contenido con las
 * herramientas de siempre (editar, ocultar, rechazar); "Descartado" = no había problema.
 */
export const AdminReportsScreen = memo(function AdminReportsScreen() {
  const colors = useThemedColors();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ReportStatus>('open');

  const {
    data: reports = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['admin-content-reports', status],
    queryFn: () => getContentReports(status),
  });
  useRefreshOnFocus(refetch);

  const update = useMutation({
    mutationFn: (v: { id: string; status: 'actioned' | 'dismissed' }) =>
      setContentReportStatus(v.id, v.status),
    onSuccess: (_, v) => {
      queryClient.invalidateQueries({ queryKey: ['admin-content-reports'] });
      Toast.show({
        type: 'success',
        text1: v.status === 'actioned' ? 'Marcado como resuelto' : 'Reporte descartado',
        position: 'top',
      });
    },
    onError: () =>
      Toast.show({ type: 'error', text1: 'No se pudo actualizar el reporte', position: 'top' }),
  });

  const renderReport = (r: ContentReport) => (
    <View
      key={r.id}
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.light,
        borderWidth: 1,
        borderRadius: 12,
        padding: spacing.md,
        gap: spacing.xs,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm }}>
        <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '600' }}>
          {REPORT_ENTITY_LABELS[r.entityType]}
        </Text>
        <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>
          {formatDate(r.createdAt, DATE_FORMAT_OPTIONS.full)}
        </Text>
      </View>
      <Text
        style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}
        numberOfLines={3}
      >
        {r.entityLabel ?? 'El contenido ya no existe'}
      </Text>
      <Text style={{ color: colors.text.primary, fontSize: 14 }}>
        Motivo: {REASON_LABEL[r.reason] ?? r.reason}
      </Text>
      {r.details ? (
        <Text style={{ color: colors.text.secondary, fontSize: 14 }}>“{r.details}”</Text>
      ) : null}

      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs }}
      >
        {r.entityHref && (
          <ActionButton label="Ver contenido" onPress={() => router.push(r.entityHref as any)} />
        )}
        {status === 'open' && (
          <>
            <ActionButton
              label="Marcar resuelto"
              primary
              disabled={update.isPending}
              onPress={() => update.mutate({ id: r.id, status: 'actioned' })}
            />
            <ActionButton
              label="Descartar"
              disabled={update.isPending}
              onPress={() => update.mutate({ id: r.id, status: 'dismissed' })}
            />
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <View style={styles.contentWrapper}>
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <View style={styles.headerRow}>
              <BackButton href="/(app)/(tabs)/manage/admin" />
              <View style={styles.headerContent}>
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                  Reportes de contenido
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                  Lo que los usuarios marcaron como inapropiado.
                </Text>
              </View>
            </View>
          </View>

          <TabSelector
            tabs={TABS}
            activeTab={status}
            onTabChange={(id) => setStatus(id as ReportStatus)}
          />

          <View style={{ padding: spacing.md, gap: spacing.sm }}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary[600]} />
            ) : reports.length === 0 ? (
              <Text
                style={{ color: colors.text.secondary, textAlign: 'center', padding: spacing.lg }}
              >
                No hay reportes en esta lista.
              </Text>
            ) : (
              reports.map(renderReport)
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

function ActionButton({
  label,
  onPress,
  primary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  const colors = useThemedColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: primary ? colors.primary[500] : colors.border.medium,
        backgroundColor: primary ? colors.primary[500] : 'transparent',
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          color: primary ? colors.text.inverse : colors.text.primary,
          fontSize: 13,
          fontWeight: '600',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
