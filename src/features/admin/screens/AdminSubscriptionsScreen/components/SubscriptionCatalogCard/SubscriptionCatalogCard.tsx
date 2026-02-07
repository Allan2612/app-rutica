import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Crown, Edit3, Check, X, ToggleLeft, ToggleRight } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useActivateSubscriptionPlan, useDeleteSubscriptionPlan } from '../../../../hooks/useAdminSubscriptions';
import type { Subscription } from '@/types/entities';
import Toast from 'react-native-toast-message';
import { styles } from './styles';

interface SubscriptionCatalogCardProps {
    plan: Subscription;
    onEdit: () => void;
}

export const SubscriptionCatalogCard = memo(function SubscriptionCatalogCard({
    plan,
    onEdit,
}: SubscriptionCatalogCardProps) {
    const colors = useThemedColors();
    const activateMutation = useActivateSubscriptionPlan();
    const deleteMutation = useDeleteSubscriptionPlan();

    const isFullPremium = plan.type_sub === 'full_premium';

    const handleToggleActive = async () => {
        try {
            if (plan.is_active_sub) {
                await deleteMutation.mutateAsync(plan.id_sub);
                Toast.show({
                    type: 'success',
                    text1: 'Plan desactivado',
                    text2: `"${plan.name_sub}" ya no está disponible para los usuarios.`,
                });
            } else {
                await activateMutation.mutateAsync(plan.id_sub);
                Toast.show({
                    type: 'success',
                    text1: 'Plan activado',
                    text2: `"${plan.name_sub}" ahora está disponible.`,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo cambiar el estado del plan.',
            });
        }
    };

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: colors.background.primary,
                borderColor: plan.is_active_sub ? colors.border.light : '#ef4444',
                opacity: plan.is_active_sub ? 1 : 0.7,
            },
        ]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={[
                    styles.iconWrapper,
                    { backgroundColor: isFullPremium ? '#fef9c3' : '#dbeafe' },
                ]}>
                    <Crown size={20} color={isFullPremium ? '#eab308' : '#3b82f6'} />
                </View>
                <View style={styles.headerContent}>
                    <Text style={[styles.planName, { color: colors.text.primary }]}>
                        {plan.name_sub}
                    </Text>
                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: colors.primary[500] }]}>
                            ₡{plan.price_sub.toLocaleString()}
                        </Text>
                        {plan.is_recurring_sub && (
                            <Text style={[styles.pricePeriod, { color: colors.text.tertiary }]}>
                                /mes
                            </Text>
                        )}
                    </View>
                </View>

                {/* Status Badge */}
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: plan.is_active_sub ? '#d1fae5' : '#fef2f2' },
                ]}>
                    {plan.is_active_sub ? (
                        <Check size={14} color="#10b981" />
                    ) : (
                        <X size={14} color="#ef4444" />
                    )}
                    <Text style={[
                        styles.statusText,
                        { color: plan.is_active_sub ? '#10b981' : '#ef4444' },
                    ]}>
                        {plan.is_active_sub ? 'Activo' : 'Inactivo'}
                    </Text>
                </View>
            </View>

            {/* Description */}
            <Text style={[styles.description, { color: colors.text.secondary }]}>
                {plan.description_sub}
            </Text>

            {/* Features */}
            {plan.features_sub && plan.features_sub.length > 0 && (
                <View style={styles.features}>
                    {plan.features_sub.slice(0, 3).map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <Check size={14} color="#10b981" />
                            <Text style={[styles.featureText, { color: colors.text.secondary }]}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                    {plan.features_sub.length > 3 && (
                        <Text style={[styles.moreFeatures, { color: colors.text.tertiary }]}>
                            +{plan.features_sub.length - 3} características más
                        </Text>
                    )}
                </View>
            )}

            {/* Meta Info */}
            <View style={[styles.metaRow, { borderTopColor: colors.border.light }]}>
                <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
                    Tipo: {plan.type_sub}
                </Text>
                <Text style={[styles.metaText, { color: colors.text.tertiary }]}>
                    Orden: {plan.display_order_sub}
                </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <Pressable
                    style={[styles.actionButton, { borderColor: colors.border.medium }]}
                    onPress={handleToggleActive}
                    disabled={activateMutation.isPending || deleteMutation.isPending}
                >
                    {plan.is_active_sub ? (
                        <ToggleRight size={18} color="#ef4444" />
                    ) : (
                        <ToggleLeft size={18} color="#10b981" />
                    )}
                    <Text style={[
                        styles.actionButtonText,
                        { color: plan.is_active_sub ? '#ef4444' : '#10b981' },
                    ]}>
                        {plan.is_active_sub ? 'Desactivar' : 'Activar'}
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.actionButton, { backgroundColor: colors.primary[500] }]}
                    onPress={onEdit}
                >
                    <Edit3 size={16} color="#fff" />
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                        Editar
                    </Text>
                </Pressable>
            </View>
        </View>
    );
});
