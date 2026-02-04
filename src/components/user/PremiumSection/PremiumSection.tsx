import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Crown, Check, Sparkles, Clock, XCircle } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useSubscriptions } from '@/features/user/hooks/useSubscriptions';
import { getSubscriptionPlanInfo } from '@/types/entities';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { styles } from './styles';

interface PremiumSectionProps {
    onSubscribePress: () => void;
}

export const PremiumSection = memo(function PremiumSection({
    onSubscribePress,
}: PremiumSectionProps) {
    const colors = useThemedColors();
    const { approvedSubscriptions, pendingSubscriptions, isPremium, isLoading } = useSubscriptions();

    // Obtener información de todos los planes aprobados
    const approvedPlans = approvedSubscriptions
        .map(sub => ({
            subscription: sub,
            planInfo: sub.subscription?.type_sub ? getSubscriptionPlanInfo(sub.subscription.type_sub) : null,
        }))
        .filter(item => item.planInfo);

    // Obtener información de planes pendientes
    const pendingPlans = pendingSubscriptions
        .map(sub => ({
            subscription: sub,
            planInfo: sub.subscription?.type_sub ? getSubscriptionPlanInfo(sub.subscription.type_sub) : null,
        }))
        .filter(item => item.planInfo);

    if (isLoading) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background.primary,
                        borderColor: colors.border.light,
                    },
                ]}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary[500]} />
                </View>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.light,
                },
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Crown size={22} color={colors.warning} />
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        Premium
                    </Text>
                </View>
                {isPremium && (
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: colors.success + '20' },
                        ]}
                    >
                        <Text style={[styles.badgeText, { color: colors.success }]}>
                            Activo
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                {(isPremium || pendingPlans.length > 0) ? (
                    // Usuario con suscripciones - mostrar aprobadas y pendientes
                    <>
                        {/* Suscripciones Aprobadas */}
                        {approvedPlans.map(({ subscription, planInfo }, index) => (
                            <View
                                key={subscription.id_psub}
                                style={[
                                    styles.subscriptionCard,
                                    {
                                        backgroundColor: colors.background.tertiary,
                                        marginBottom: 12,
                                    },
                                ]}
                            >
                                <View style={styles.subscriptionHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={[styles.subscriptionName, { color: colors.text.primary }]}
                                        >
                                            {planInfo?.name}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                            <Check size={14} color={colors.success} />
                                            <Text style={[{ color: colors.success, fontSize: 12, marginLeft: 4 }]}>
                                                Aprobado
                                            </Text>
                                        </View>
                                    </View>
                                    <Text
                                        style={[styles.subscriptionPrice, { color: colors.primary[500] }]}
                                    >
                                        {planInfo?.price}
                                    </Text>
                                </View>

                                {index === 0 && (
                                    <Text style={[styles.subscriptionDate, { color: colors.text.secondary }]}>
                                        Activo desde:{' '}
                                        {format(new Date(subscription.approved_at_psub || subscription.subscribed_at_psub), "d 'de' MMMM, yyyy", {
                                            locale: es,
                                        })}
                                    </Text>
                                )}

                                <View style={styles.featuresList}>
                                    {planInfo?.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                                        <View key={featureIndex} style={styles.featureItem}>
                                            <Check size={14} color={colors.success} />
                                            <Text
                                                style={[styles.featureText, { color: colors.text.secondary }]}
                                            >
                                                {feature}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}

                        {/* Suscripciones Pendientes */}
                        {pendingPlans.map(({ subscription, planInfo }) => (
                            <View
                                key={subscription.id_psub}
                                style={[
                                    styles.subscriptionCard,
                                    {
                                        backgroundColor: colors.warning + '10',
                                        borderWidth: 1,
                                        borderColor: colors.warning + '40',
                                        marginBottom: 12,
                                    },
                                ]}
                            >
                                <View style={styles.subscriptionHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={[styles.subscriptionName, { color: colors.text.primary }]}
                                        >
                                            {planInfo?.name}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                            <Clock size={14} color={colors.warning} />
                                            <Text style={[{ color: colors.warning, fontSize: 12, marginLeft: 4 }]}>
                                                Pendiente de aprobación
                                            </Text>
                                        </View>
                                    </View>
                                    <Text
                                        style={[styles.subscriptionPrice, { color: colors.text.secondary }]}
                                    >
                                        {planInfo?.price}
                                    </Text>
                                </View>

                                <Text style={[styles.subscriptionDate, { color: colors.text.secondary }]}>
                                    Solicitado el:{' '}
                                    {format(new Date(subscription.subscribed_at_psub), "d 'de' MMMM, yyyy", {
                                        locale: es,
                                    })}
                                </Text>
                                <Text style={[{ color: colors.text.secondary, fontSize: 13, marginTop: 4 }]}>
                                    Referencia de pago: {subscription.payment_reference_psub}
                                </Text>
                            </View>
                        ))}
                    </>
                ) : (
                    // Usuario sin suscripción
                    <View style={styles.noSubscription}>
                        <Sparkles
                            size={40}
                            color={colors.warning}
                            style={styles.noSubscriptionIcon}
                        />
                        <Text
                            style={[styles.noSubscriptionTitle, { color: colors.text.primary }]}
                        >
                            ¡Hazte Premium!
                        </Text>
                        <Text
                            style={[styles.noSubscriptionText, { color: colors.text.secondary }]}
                        >
                            Desbloquea funciones exclusivas como galerías extendidas, dashboard
                            de promociones y mucho más.
                        </Text>
                        <Pressable
                            style={[
                                styles.subscribeButton,
                                { backgroundColor: colors.primary[500] },
                            ]}
                            onPress={onSubscribePress}
                        >
                            <Text style={styles.subscribeButtonText}>Ver Planes Premium</Text>
                        </Pressable>
                    </View>
                )}

                {/* Botón para adquirir más planes - visible siempre */}
                {(isPremium || pendingPlans.length > 0) && (
                    <Pressable
                        style={[
                            styles.addMoreButton,
                            {
                                backgroundColor: colors.background.primary,
                                borderColor: colors.primary[500],
                            },
                        ]}
                        onPress={onSubscribePress}
                    >
                        <Crown size={16} color={colors.primary[500]} />
                        <Text style={[styles.addMoreButtonText, { color: colors.primary[500] }]}>
                            Adquirir Más Planes
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
});
