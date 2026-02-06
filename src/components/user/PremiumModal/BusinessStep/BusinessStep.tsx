import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Building2, Check, Store } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUserBusinesses } from '@/features/business/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';
import { styles } from './styles';

interface BusinessStepProps {
    selectedPlans: SubscriptionType[];
    selectedBusinessId: string | null;
    onSelectBusiness: (businessId: string) => void;
}

export const BusinessStep = memo(function BusinessStep({
    selectedPlans,
    selectedBusinessId,
    onSelectBusiness,
}: BusinessStepProps) {
    const colors = useThemedColors();
    const { data: businesses = [], isLoading } = useUserBusinesses();

    // Obtener nombres de los planes seleccionados
    const selectedPlansNames = SUBSCRIPTION_PLANS
        .filter(plan => selectedPlans.includes(plan.type))
        .map(plan => plan.name)
        .join(', ');

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
                    Debes crear un negocio antes de poder comprar este paquete.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Info de planes seleccionados */}
            <View style={[styles.selectedPlansInfo, { backgroundColor: colors.primary[50] }]}>
                <Text style={[styles.selectedPlansTitle, { color: colors.primary[700] }]}>
                    Plan seleccionado:
                </Text>
                <Text style={[styles.selectedPlansText, { color: colors.primary[600] }]}>
                    {selectedPlansNames}
                </Text>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                Selecciona el negocio al que deseas aplicar este paquete
            </Text>

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
                        onPress={() => onSelectBusiness(business.id)}
                    >
                        <View style={styles.businessCardContent}>
                            <Building2
                                size={20}
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
                            {isSelected && (
                                <Check size={16} color="#FFFFFF" />
                            )}
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
});
