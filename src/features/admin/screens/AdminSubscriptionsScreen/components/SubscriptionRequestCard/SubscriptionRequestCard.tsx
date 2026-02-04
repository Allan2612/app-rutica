import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Crown, Clock, CheckCircle, XCircle, User } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useThemedColors } from '@/hooks';
import type { ProfileSubscriptionWithDetails } from '../../../services/adminSubscriptions.service';
import { styles } from './styles';
import { statusConfig, getUserName } from '../common/subscriptionHelpers';

interface SubscriptionRequestCardProps {
    subscription: ProfileSubscriptionWithDetails;
    onApprove: () => void;
    onReject: () => void;
}

export const SubscriptionRequestCard = memo(function SubscriptionRequestCard({
    subscription,
    onApprove,
    onReject,
}: SubscriptionRequestCardProps) {
    const colors = useThemedColors();

    const status = statusConfig[subscription.status_psub] || statusConfig.pending;
    const StatusIcon = status.icon;
    const userName = getUserName(subscription.profile);
    const planName = subscription.subscription_details?.name_sub || 'Plan desconocido';
    const planPrice = subscription.subscription_details?.price_sub || 0;

    return (
        <View style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.light }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={[styles.iconWrapper, { backgroundColor: '#fef9c3' }]}>
                    <Crown size={20} color="#eab308" />
                </View>
                <View style={styles.headerContent}>
                    <Text style={[styles.planName, { color: colors.text.primary }]}>
                        {planName}
                    </Text>
                    <Text style={[styles.price, { color: colors.primary[500] }]}>
                        ₡{planPrice.toLocaleString()}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <StatusIcon size={14} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                    </Text>
                </View>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
                <User size={16} color={colors.text.tertiary} />
                <Text style={[styles.userName, { color: colors.text.secondary }]}>
                    {userName}
                </Text>
            </View>

            {/* Details */}
            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                        Referencia de pago:
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                        {subscription.payment_reference_psub}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                        Fecha solicitud:
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                        {format(new Date(subscription.created_at_psub), "d 'de' MMMM, yyyy - HH:mm", { locale: es })}
                    </Text>
                </View>
                {subscription.payment_note_psub && (
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                            Nota:
                        </Text>
                        <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                            {subscription.payment_note_psub}
                        </Text>
                    </View>
                )}
                {subscription.rejection_reason_psub && (
                    <View style={[styles.noteBox, { backgroundColor: '#2d1f1f' }]}>
                        <Text style={[styles.noteLabel, { color: '#ef4444' }]}>
                            Razón de rechazo:
                        </Text>
                        <Text style={[styles.noteText, { color: '#fca5a5' }]}>
                            {subscription.rejection_reason_psub}
                        </Text>
                    </View>
                )}
            </View>

            {/* Actions - Only show for pending */}
            {subscription.status_psub === 'pending' && (
                <View style={styles.actions}>
                    <Pressable
                        style={[styles.actionButton, styles.rejectButton, { borderColor: '#ef4444' }]}
                        onPress={onReject}
                    >
                        <XCircle size={16} color="#ef4444" />
                        <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
                            Rechazar
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.actionButton, styles.approveButton, { backgroundColor: '#10b981' }]}
                        onPress={onApprove}
                    >
                        <CheckCircle size={16} color="#fff" />
                        <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                            Aprobar
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
});
