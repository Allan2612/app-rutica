import { memo, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Toast from 'react-native-toast-message';
import { useThemedColors } from '@/hooks';
import { BackButton } from '@/components/ui';
import {
    useAdminSubscriptions,
    useAdminSubscriptionStats,
    useApproveSubscription,
    useRejectSubscription,
} from '../../hooks/useAdminSubscriptions';
import type { SubscriptionStatus } from '@/types/enums';
import {
    SubscriptionStats,
    SubscriptionFilters,
    SubscriptionList,
    SubscriptionActionDialog,
    toastConfig,
} from './components';
import type { ProfileSubscriptionWithDetails } from '../../services/adminSubscriptions.service';
import { styles } from './styles';

export const AdminSubscriptionsScreen = memo(function AdminSubscriptionsScreen() {
    const colors = useThemedColors();

    const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus | 'all'>('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionDialog, setActionDialog] = useState<{
        visible: boolean;
        subscription: ProfileSubscriptionWithDetails | null;
        action: 'approve' | 'reject';
    }>({ visible: false, subscription: null, action: 'approve' });

    const filters = useMemo(() => ({
        status: selectedStatus,
        search: searchQuery,
    }), [selectedStatus, searchQuery]);

    const { data: subscriptions = [], isLoading, refetch, isRefetching } = useAdminSubscriptions(filters);
    const { data: stats } = useAdminSubscriptionStats();
    const approveMutation = useApproveSubscription();
    const rejectMutation = useRejectSubscription();

    const handleApprove = useCallback((subscription: ProfileSubscriptionWithDetails) => {
        setActionDialog({ visible: true, subscription, action: 'approve' });
    }, []);

    const handleReject = useCallback((subscription: ProfileSubscriptionWithDetails) => {
        setActionDialog({ visible: true, subscription, action: 'reject' });
    }, []);

    const handleConfirmAction = useCallback(async (reason?: string) => {
        if (!actionDialog.subscription) return;

        try {
            if (actionDialog.action === 'approve') {
                await approveMutation.mutateAsync(actionDialog.subscription.id_psub);
                Toast.show({
                    type: 'success',
                    text1: 'Suscripción aprobada',
                    text2: 'El usuario ahora tiene acceso al plan premium.',
                });
            } else {
                await rejectMutation.mutateAsync({
                    subscriptionId: actionDialog.subscription.id_psub,
                    reason,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Suscripción rechazada',
                    text2: 'Se ha notificado al usuario.',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo procesar la acción.',
            });
        }

        setActionDialog({ visible: false, subscription: null, action: 'approve' });
    }, [actionDialog, approveMutation, rejectMutation]);

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
                                    Gestión de Suscripciones
                                </Text>
                                <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                                    Administra solicitudes de pago de planes premium.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {stats && <SubscriptionStats stats={stats} />}

                    <SubscriptionFilters
                        selectedStatus={selectedStatus}
                        searchQuery={searchQuery}
                        onStatusChange={setSelectedStatus}
                        onSearchChange={setSearchQuery}
                    />

                    <SubscriptionList
                        subscriptions={subscriptions}
                        isLoading={isLoading}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                </View>
            </ScrollView>

            <SubscriptionActionDialog
                visible={actionDialog.visible}
                action={actionDialog.action}
                subscription={actionDialog.subscription}
                onConfirm={handleConfirmAction}
                onClose={() => setActionDialog({ visible: false, subscription: null, action: 'approve' })}
                isLoading={approveMutation.isPending || rejectMutation.isPending}
            />

            <Toast config={toastConfig} />
        </View>
    );
});
