import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Building2, Check, Store, Package } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUserBusinesses } from '@/features/business/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';
import type { BusinessSelections } from '../usePremiumModal';
import { styles } from './styles';

interface BusinessStepProps {
    businessRequiredPlans: SubscriptionType[];
    businessSelections: BusinessSelections;
    onSelectBusiness: (planType: SubscriptionType, businessId: string) => void;
}

export const BusinessStep = memo(function BusinessStep({
    businessRequiredPlans,
    businessSelections,
    onSelectBusiness,
}: BusinessStepProps) {
    const colors = useThemedColors();
    const { data: businesses = [], isLoading } = useUserBusinesses();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                    Cargando tus negocios...
                </Text>
            </View>
        );
    }

    if (businesses.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Store size={48} color={colors.text.tertiary} />
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                    No tienes negocios registrados
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                    Debes crear un negocio antes de poder comprar estos paquetes.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                Selecciona a qué negocio deseas aplicar cada paquete
            </Text>

            {businessRequiredPlans.map((planType) => {
                const plan = SUBSCRIPTION_PLANS.find(p => p.type === planType);
                if (!plan) return null;

                const selectedBusinessId = businessSelections[planType];

                return (
                    <View key={planType} style={[styles.planSection, { borderColor: colors.border.light }]}>
                        <View style={styles.planHeader}>
                            <Package size={20} color={colors.primary[500]} />
                            <Text style={[styles.planName, { color: colors.text.primary }]}>
                                {plan.name}
                            </Text>
                        </View>
                        <Text style={[styles.planSubtitle, { color: colors.text.tertiary }]}>
                            Selecciona el negocio:
                        </Text>
                        <View style={styles.businessList}>
                            {businesses.map((business: any) => {
                                const isSelected = selectedBusinessId === business.id;

                                return (
                                    <Pressable
                                        key={business.id}
                                        style={[
                                            styles.businessCard,
                                            {
                                                backgroundColor: isSelected
                                                    ? colors.primary[500]
                                                    : colors.background.secondary,
                                                borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                                            },
                                        ]}
                                        onPress={() => onSelectBusiness(planType, business.id)}
                                    >
                                        <View style={styles.businessCardContent}>
                                            <Building2
                                                size={18}
                                                color={isSelected ? '#FFFFFF' : colors.text.tertiary}
                                            />
                                            <Text
                                                style={[
                                                    styles.businessName,
                                                    { color: isSelected ? '#FFFFFF' : colors.text.primary },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {business.name}
                                            </Text>
                                            {isSelected && <Check size={18} color="#FFFFFF" />}
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
});
