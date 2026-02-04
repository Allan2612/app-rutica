import { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Crown } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { SubscriptionRequestCard } from '../SubscriptionRequestCard';
import type { ProfileSubscriptionWithDetails } from '../../../services/adminSubscriptions.service';
import { styles } from './styles';

interface SubscriptionListProps {
    subscriptions: ProfileSubscriptionWithDetails[];
    isLoading: boolean;
    onApprove: (subscription: ProfileSubscriptionWithDetails) => void;
    onReject: (subscription: ProfileSubscriptionWithDetails) => void;
}

export const SubscriptionList = memo(function SubscriptionList({
    subscriptions,
    isLoading,
    onApprove,
    onReject,
}: SubscriptionListProps) {
    const colors = useThemedColors();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
        );
    }

    if (subscriptions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <View style={[styles.emptyIconWrapper, { backgroundColor: colors.primary[100] }]}>
                    <Crown size={32} color={colors.primary[500]} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                    No hay suscripciones
                </Text>
                <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
                    No se encontraron suscripciones con los filtros aplicados.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.list}>
            {subscriptions.map((subscription) => (
                <SubscriptionRequestCard
                    key={subscription.id_psub}
                    subscription={subscription}
                    onApprove={() => onApprove(subscription)}
                    onReject={() => onReject(subscription)}
                />
            ))}
        </View>
    );
});
