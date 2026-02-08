import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BarChart3, ChevronRight } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { UserSubscriptionDetail } from '@/services/userSubscriptions.service';
import { SUBSCRIPTION_CONFIG } from '../../constants';
import { styles } from './styles';

interface DashboardCardProps {
    subscription: UserSubscriptionDetail;
    onPress: () => void;
}

export const DashboardCard = memo(function DashboardCard({
    subscription,
    onPress,
}: DashboardCardProps) {
    const colors = useThemedColors();
    const config = SUBSCRIPTION_CONFIG.dashboard;

    const formattedPrice = new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
    }).format(subscription.price);

    const approvedDate = subscription.approvedAt
        ? new Date(subscription.approvedAt).toLocaleDateString('es-CR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : null;

    return (
        <Pressable
            style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}
            onPress={onPress}
        >
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
                    <BarChart3 color={config.iconColor} size={24} strokeWidth={2} />
                </View>
                <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {subscription.subscriptionName}
                    </Text>
                    <View style={styles.meta}>
                        <Text style={[styles.price, { color: config.iconColor }]}>
                            {formattedPrice}
                        </Text>
                        {approvedDate && (
                            <>
                                <View style={[styles.metaDot, { backgroundColor: colors.text.tertiary }]} />
                                <Text style={[styles.date, { color: colors.text.tertiary }]}>
                                    {approvedDate}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
                <ChevronRight color={colors.text.tertiary} size={20} />
            </View>
        </Pressable>
    );
});
