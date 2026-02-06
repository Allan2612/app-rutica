import { memo } from 'react';
import { View, Text } from 'react-native';
import { Crown } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { UserSubscriptionDetail, SubscriptionUsageDetail } from '@/services/userSubscriptions.service';
import { SUBSCRIPTION_CONFIG } from '../../constants';
import { EntityIcon } from '../EntityIcon';
import { UsageCard } from '../UsageCard';
import { styles } from './styles';

interface SubscriptionCardProps {
    subscription: UserSubscriptionDetail;
}

export const SubscriptionCard = memo(function SubscriptionCard({
    subscription,
}: SubscriptionCardProps) {
    const colors = useThemedColors();
    const config = SUBSCRIPTION_CONFIG[subscription.subscriptionType];
    const Icon = config?.icon ?? Crown;
    const iconColor = config?.iconColor ?? '#f59e0b';
    const iconBg = config?.iconBg ?? '#fef3c7';

    const groupedUsage = subscription.usageDetails.reduce((acc, usage) => {
        const entityKey = usage.entity?.id || 'no-entity';
        if (!acc[entityKey]) {
            acc[entityKey] = {
                entity: usage.entity,
                usages: [],
            };
        }
        acc[entityKey].usages.push(usage);
        return acc;
    }, {} as Record<string, { entity: typeof subscription.usageDetails[0]['entity']; usages: SubscriptionUsageDetail[] }>);

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

    const expiresDate = subscription.expiresAt
        ? new Date(subscription.expiresAt).toLocaleDateString('es-CR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : null;

    return (
        <View style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                    <Icon color={iconColor} size={24} strokeWidth={2} />
                </View>
                <View style={styles.headerContent}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        {subscription.subscriptionName}
                    </Text>
                    <View style={styles.meta}>
                        <Text style={[styles.price, { color: iconColor }]}>
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
                        {expiresDate && (
                            <>
                                <View style={[styles.metaDot, { backgroundColor: colors.text.tertiary }]} />
                                <Text style={[styles.date, { color: '#f59e0b' }]}>
                                    Expira: {expiresDate}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            </View>

            {Object.values(groupedUsage).length > 0 && (
                <View style={styles.usageSection}>
                    {Object.values(groupedUsage).map((group, index) => (
                        <View key={group.entity?.id || index}>
                            {group.entity && (
                                <View style={[styles.entityHeader, { borderTopColor: colors.border.light }]}>
                                    <EntityIcon type={group.entity.type} color={iconColor} size={16} />
                                    <View style={styles.entityTextContainer}>
                                        <Text style={[styles.entityType, { color: colors.text.tertiary }]}>
                                            {group.entity.type === 'attraction' ? 'Atracción' :
                                                group.entity.type === 'event' ? 'Evento' : 'Negocio'}
                                        </Text>
                                        <Text style={[styles.entityName, { color: colors.text.primary }]} numberOfLines={1}>
                                            {group.entity.name}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            <View style={styles.usageGrid}>
                                {group.usages.map((usage, idx) => (
                                    <UsageCard
                                        key={idx}
                                        usage={usage}
                                        subscriptionColor={iconColor}
                                    />
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {subscription.usageDetails.length === 0 && (
                <Text style={[styles.description, { color: colors.text.secondary }]}>
                    {subscription.subscriptionDescription}
                </Text>
            )}
        </View>
    );
});
