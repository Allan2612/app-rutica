import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Tag, BarChart3, Images, Package, Camera, Calendar, Sparkles, Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import { styles } from './styles';

const PLAN_ICONS: Record<string, typeof Tag> = {
    promotions: Tag,
    dashboard: BarChart3,
    gallery_business: Images,
    package_products: Package,
    gallery_attractions: Camera,
    gallery_events: Calendar,
    full_premium: Sparkles,
};

const PLAN_COLORS: Record<string, { icon: string; bg: string }> = {
    promotions: { icon: '#f59e0b', bg: '#fef3c7' },
    dashboard: { icon: '#3b82f6', bg: '#dbeafe' },
    gallery_business: { icon: '#8b5cf6', bg: '#ede9fe' },
    package_products: { icon: '#10b981', bg: '#d1fae5' },
    gallery_attractions: { icon: '#ec4899', bg: '#fce7f3' },
    gallery_events: { icon: '#06b6d4', bg: '#cffafe' },
    full_premium: { icon: '#f59e0b', bg: '#fef3c7' },
};

interface AvailablePlansSectionProps {
    onBuyPress: (planType: string) => void;
}

export const AvailablePlansSection = memo(function AvailablePlansSection({
    onBuyPress,
}: AvailablePlansSectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Paquetes Disponibles
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                Potencia tu negocio con nuestros paquetes premium
            </Text>

            <View style={styles.grid}>
                {SUBSCRIPTION_PLANS.map((plan) => {
                    const Icon = PLAN_ICONS[plan.type] || Tag;
                    const colorConfig = PLAN_COLORS[plan.type] || PLAN_COLORS.promotions;
                    const isFullPremium = plan.type === 'full_premium';

                    return (
                        <Pressable
                            key={plan.type}
                            style={[styles.planCard, { backgroundColor: colors.background.primary, borderColor: isFullPremium ? colorConfig.icon : colors.border.medium, borderWidth: isFullPremium ? 2 : 1 }]}
                            onPress={() => onBuyPress(plan.type)}
                        >
                            {isFullPremium && (
                                <View style={[styles.featuredBadge, { backgroundColor: colorConfig.icon }]}>
                                    <Sparkles color="#FFFFFF" size={10} />
                                    <Text style={styles.featuredBadgeText}>Popular</Text>
                                </View>
                            )}

                            <View style={[styles.planIconContainer, { backgroundColor: colorConfig.bg }]}>
                                <Icon color={colorConfig.icon} size={20} strokeWidth={2} />
                            </View>

                            <Text style={[styles.planName, { color: colors.text.primary }]} numberOfLines={1}>
                                {plan.name}
                            </Text>

                            <Text style={[styles.planPrice, { color: colorConfig.icon }]}>
                                {plan.price}
                            </Text>

                            <View style={styles.featuresList}>
                                {plan.features.slice(0, 2).map((feature, index) => (
                                    <View key={index} style={styles.featureItem}>
                                        <Check color={colorConfig.icon} size={12} strokeWidth={2.5} />
                                        <Text style={[styles.featureText, { color: colors.text.secondary }]} numberOfLines={1}>
                                            {feature}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
});
