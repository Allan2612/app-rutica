import { memo, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { BackButton } from '@/components/ui';
import {
  VerificationRequestCard,
  VerificationFilters,
  VerificationStatsCard,
  ModerationConfirmDialog,
  VerificationDetailModal,
} from '@/components/admin';
import { PromotionModerationDialog } from '@/components/promotions';
import {
  useVerificationRequests,
  useVerificationStats,
  useUpdateModeration,
} from '../../hooks/useAdminVerification';
import type {
  VerificationEntityType,
  VerificationRequest,
} from '../../services/verification.service';
import type { ModerationStatus } from '@/types/enums';
import { styles } from './styles';

const TYPE_LABELS: Record<VerificationEntityType, string> = {
  business: 'el negocio',
  event: 'el evento',
  attraction: 'la atracción',
  promotion: 'la promoción',
};

export const AdminVerificationScreen = memo(function AdminVerificationScreen() {
  const colors = useThemedColors();
  const router = useRouter();

  // Filter state
  const [selectedType, setSelectedType] = useState<VerificationEntityType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ModerationStatus | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Status management dialog state
  const [statusDialog, setStatusDialog] = useState<{
    visible: boolean;
    request: VerificationRequest | null;
  }>({
    visible: false,
    request: null,
  });

  // Detail modal state
  const [detailModal, setDetailModal] = useState<{
    visible: boolean;
    request: VerificationRequest | null;
  }>({
    visible: false,
    request: null,
  });

  // Data fetching
  const filters = useMemo(
    () => ({
      type: selectedType,
      status: selectedStatus,
      search: searchQuery,
    }),
    [selectedType, selectedStatus, searchQuery]
  );

  const { data: requests = [], isLoading, refetch, isRefetching } = useVerificationRequests(filters);
  const { data: stats } = useVerificationStats();
  const updateMutation = useUpdateModeration();

  // Handlers
  const handleManageStatus = useCallback((request: VerificationRequest) => {
    setStatusDialog({ visible: true, request });
  }, []);

  const handleView = useCallback(
    (request: VerificationRequest) => {
      // Open detail modal
      setDetailModal({ visible: true, request });
    },
    []
  );

  const handleEdit = useCallback(
    (request: VerificationRequest) => {
      // Navigate to detail screen based on type (public view)
      switch (request.type) {
        case 'business':
          router.push(`/(app)/(tabs)/businesses/${request.id}`);
          break;
        case 'event':
          router.push(`/(app)/(tabs)/events/${request.id}`);
          break;
        case 'attraction':
          router.push(`/(app)/(tabs)/attractions/${request.id}`);
          break;
        case 'promotion':
          // For promotions, navigate to the associated business
          if (request.businessId) {
            router.push(`/(app)/(tabs)/businesses/${request.businessId}`);
          }
          break;
      }
    },
    [router]
  );

  const handleConfirmModeration = useCallback(
    async (data: {
      moderationStatus?: ModerationStatus;
      moderationNote?: string;
      paymentState?: 'pending' | 'paid' | 'rejected';
      paymentNote?: string;
    }) => {
      if (!statusDialog.request) return;

      const { request } = statusDialog;

      try {
        await updateMutation.mutateAsync({
          id: request.id,
          type: request.type,
          status: data.moderationStatus,
          note: data.moderationNote,
          paymentState: data.paymentState,
          paymentNote: data.paymentNote,
        });

        // Build dynamic toast message
        const actions: string[] = [];
        if (data.moderationStatus) {
          actions.push(
            data.moderationStatus === 'approved' ? 'aprobado' : 'rechazado'
          );
        }
        if (data.paymentState) {
          const paymentStateText =
            data.paymentState === 'paid'
              ? 'marcado como pagado'
              : data.paymentState === 'rejected'
              ? 'pago rechazado'
              : 'pago marcado pendiente';
          actions.push(paymentStateText);
        }

        Toast.show({
          type: 'success',
          text1: 'Estado actualizado',
          text2: `"${request.name}" ha sido ${actions.join(' y ')}.`,
          position: 'top',
          visibilityTime: 3000,
        });

        setStatusDialog({ visible: false, request: null });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo procesar la solicitud. Intenta de nuevo.',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    },
    [statusDialog, updateMutation]
  );

  const handleCancelDialog = useCallback(() => {
    setStatusDialog({ visible: false, request: null });
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailModal({ visible: false, request: null });
  }, []);

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[styles.emptyIconWrapper, { backgroundColor: colors.background.tertiary }]}
      >
        <CheckCircle color={colors.success} size={40} strokeWidth={1.5} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
        {selectedStatus === 'pending' ? 'Sin solicitudes pendientes' : 'Sin resultados'}
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
        {selectedStatus === 'pending'
          ? 'No hay solicitudes de verificación pendientes en este momento. ¡Buen trabajo!'
          : 'No se encontraron solicitudes con los filtros seleccionados.'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      >
        <View style={styles.contentWrapper}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <View style={styles.headerRow}>
              <BackButton href="/(app)/(tabs)/manage" />
              <View style={styles.headerContent}>
                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                  Verificación de Contenido
                </Text>
                <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                  Revisa y aprueba solicitudes de negocios, eventos, atracciones y promociones.
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Card */}
          {stats && (
            <VerificationStatsCard
              totalPending={stats.totalPending}
              pendingByType={stats.pendingByType}
            />
          )}

          {/* Filters */}
          <VerificationFilters
            selectedType={selectedType}
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
            pendingCounts={stats?.pendingByType}
            onTypeChange={setSelectedType}
            onStatusChange={setSelectedStatus}
            onSearchChange={setSearchQuery}
          />

          {/* Loading */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
              <Text
                style={[
                  styles.emptyDescription,
                  { color: colors.text.secondary, marginTop: 16 },
                ]}
              >
                Cargando solicitudes...
              </Text>
            </View>
          )}

          {/* List */}
          {!isLoading && requests.length === 0 && renderEmpty()}

          {!isLoading && requests.length > 0 && (
            <View style={styles.list}>
              {requests.map((request) => (
                <VerificationRequestCard
                  key={`${request.type}-${request.id}`}
                  {...request}
                  onManageStatus={() => handleManageStatus(request)}
                  onView={() => handleView(request)}
                  onEdit={() => handleEdit(request)}
                  isProcessing={
                    updateMutation.isPending &&
                    statusDialog.request?.id === request.id
                  }
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Status Management Dialog - Promotion Specific */}
      {statusDialog.request?.type === 'promotion' && (
        <PromotionModerationDialog
          visible={statusDialog.visible}
          promotionName={statusDialog.request?.name || ''}
          currentModerationStatus={statusDialog.request?.moderationStatus}
          currentPaymentState={statusDialog.request?.metadata?.paymentState as 'pending' | 'paid' | 'rejected' | undefined}
          onConfirm={handleConfirmModeration}
          onCancel={handleCancelDialog}
          isProcessing={updateMutation.isPending}
        />
      )}

      {/* Status Management Dialog - Other Entities */}
      {statusDialog.request?.type !== 'promotion' && (
        <ModerationConfirmDialog
          visible={statusDialog.visible}
          entityId={statusDialog.request?.id || ''}
          isPromotion={false}
          currentModerationStatus={statusDialog.request?.moderationStatus}
          currentPaymentState={statusDialog.request?.metadata?.paymentState as 'pending' | 'paid' | 'rejected' | undefined}
          onConfirm={handleConfirmModeration}
          onCancel={handleCancelDialog}
          isProcessing={updateMutation.isPending}
        />
      )}

      {/* Detail Modal */}
      <VerificationDetailModal
        visible={detailModal.visible}
        request={detailModal.request}
        onClose={handleCloseDetailModal}
      />
    </View>
  );
});
