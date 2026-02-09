import { memo, useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { ProfileSubscriptionWithDetails } from '../../../../services/adminSubscriptions.service';
import { styles } from './styles';
import { getUserName } from '../common/subscriptionHelpers';

interface SubscriptionActionDialogProps {
    visible: boolean;
    action: 'approve' | 'reject';
    subscription: ProfileSubscriptionWithDetails | null;
    onConfirm: (reason?: string) => void;
    onClose: () => void;
    isLoading: boolean;
}

export const SubscriptionActionDialog = memo(function SubscriptionActionDialog({
    visible,
    action,
    subscription,
    onConfirm,
    onClose,
    isLoading,
}: SubscriptionActionDialogProps) {
    const colors = useThemedColors();
    const [reason, setReason] = useState('');

    const isApprove = action === 'approve';

    const handleConfirm = () => {
        onConfirm(isApprove ? undefined : reason);
        setReason('');
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    if (!subscription) return null;

    const planName = subscription.subscription_details?.name_sub || 'Plan desconocido';
    const userName = getUserName(subscription.profile);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.dialog, { backgroundColor: colors.background.primary }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[
                            styles.iconWrapper,
                            { backgroundColor: isApprove ? '#d1fae5' : '#fef2f2' },
                        ]}>
                            {isApprove ? (
                                <CheckCircle size={28} color="#10b981" />
                            ) : (
                                <AlertTriangle size={28} color="#ef4444" />
                            )}
                        </View>

                        <Pressable style={styles.closeButton} onPress={handleClose}>
                            <X size={20} color={colors.text.tertiary} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {isApprove ? 'Aprobar suscripción' : 'Rechazar suscripción'}
                    </Text>

                    <Text style={[styles.message, { color: colors.text.secondary }]}>
                        {isApprove
                            ? `¿Confirmas que deseas aprobar la suscripción "${planName}" para ${userName}?`
                            : `¿Confirmas que deseas rechazar la suscripción "${planName}" para ${userName}?`
                        }
                    </Text>

                    {/* Details */}
                    <View style={[styles.detailsBox, { backgroundColor: colors.background.secondary }]}>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                                Plan:
                            </Text>
                            <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                                {planName}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                                Ref. pago:
                            </Text>
                            <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                                {subscription.payment_reference_psub}
                            </Text>
                        </View>
                    </View>

                    {/* Rejection Reason */}
                    {!isApprove && (
                        <View style={styles.reasonContainer}>
                            <Text style={[styles.reasonLabel, { color: colors.text.secondary }]}>
                                Razón del rechazo (opcional):
                            </Text>
                            <TextInput
                                style={[
                                    styles.reasonInput,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        borderColor: colors.border.medium,
                                        color: colors.text.primary,
                                    },
                                ]}
                                placeholder="Ej: Comprobante de pago no válido..."
                                placeholderTextColor={colors.text.tertiary}
                                value={reason}
                                onChangeText={setReason}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    )}

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Pressable
                            style={[styles.button, styles.cancelButton, { borderColor: colors.border.medium }]}
                            onPress={handleClose}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, { color: colors.text.secondary }]}>
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.button,
                                styles.confirmButton,
                                { backgroundColor: isApprove ? '#10b981' : '#ef4444' },
                            ]}
                            onPress={handleConfirm}
                            disabled={isLoading}
                        >
                            {isApprove ? (
                                <CheckCircle size={18} color="#fff" />
                            ) : (
                                <XCircle size={18} color="#fff" />
                            )}
                            <Text style={[styles.buttonText, { color: '#fff' }]}>
                                {isLoading ? 'Procesando...' : isApprove ? 'Aprobar' : 'Rechazar'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});
