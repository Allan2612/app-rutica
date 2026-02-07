import { memo } from 'react';
import { View, Text } from 'react-native';
import { Check, Clock } from 'lucide-react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ThemedColors } from '@/types/entities/premium';
import type { SubscriptionPlanInfo } from '@/types/entities';
import { styles } from './styles';

interface SubscriptionCardProps {
    subscription: any;
    planInfo: SubscriptionPlanInfo;
    status: 'approved' | 'pending';
    isFirst: boolean;
    colors: ThemedColors;
}

export const SubscriptionCard = memo(function SubscriptionCard({
    subscription,
    planInfo,
    status,
    isFirst,
    colors,
}: SubscriptionCardProps) {
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: status === 'approved'
                        ? colors.background.tertiary
                        : colors.warning + '10',
                    borderWidth: status === 'pending' ? 1 : 0,
                    borderColor: status === 'pending' ? colors.warning + '40' : undefined,
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={[styles.name, { color: colors.text.primary }]}>
                        {planInfo.name}
                    </Text>
                    <View style={styles.statusRow}>
                        {status === 'approved' ? (
                            <>
                                <Check size={14} color={colors.success} />
                                <Text style={[styles.statusText, { color: colors.success }]}>
                                    Aprobado
                                </Text>
                            </>
                        ) : (
                            <>
                                <Clock size={14} color={colors.warning} />
                                <Text style={[styles.statusText, { color: colors.warning }]}>
                                    Pendiente de aprobación
                                </Text>
                            </>
                        )}
                    </View>
                </View>
                <Text
                    style={[
                        styles.price,
                        { color: status === 'approved' ? colors.primary[500] : colors.text.secondary }
                    ]}
                >
                    {planInfo.price}
                </Text>
            </View>

            {status === 'approved' && isFirst && (
                <Text style={[styles.date, { color: colors.text.secondary }]}>
                    Activo desde:{' '}
                    {format(
                        new Date(subscription.approved_at_psub || subscription.subscribed_at_psub),
                        "d 'de' MMMM, yyyy",
                        { locale: es }
                    )}
                </Text>
            )}

            {status === 'approved' && (
                <View style={styles.featuresList}>
                    {planInfo.features.slice(0, 3).map((feature: string, index: number) => (
                        <View key={index} style={styles.featureItem}>
                            <Check size={14} color={colors.success} />
                            <Text style={[styles.featureText, { color: colors.text.secondary }]}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {status === 'pending' && (
                <>
                    <Text style={[styles.date, { color: colors.text.secondary }]}>
                        Solicitado el:{' '}
                        {format(new Date(subscription.subscribed_at_psub), "d 'de' MMMM, yyyy", {
                            locale: es,
                        })}
                    </Text>
                    <Text style={[styles.reference, { color: colors.text.secondary }]}>
                        Referencia de pago: {subscription.payment_reference_psub}
                    </Text>
                </>
            )}
        </View>
    );
});
