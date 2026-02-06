import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { MapPin, Calendar, Check, Compass, ImagePlus } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUserAttractions } from '@/features/attractions/hooks';
import { useUserEvents } from '@/features/events/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';
import type { EntitySelections } from '../usePremiumModal';
import { styles } from './styles';

type EntityType = 'attraction' | 'event';

interface EntityStepProps {
    entityRequiredPlans: SubscriptionType[];
    entitySelections: EntitySelections;
    onSelectEntity: (planType: SubscriptionType, entityId: string, entityType: EntityType) => void;
}

// Configuración de tipo de entidad por plan
const PLAN_ENTITY_CONFIG: Record<string, { entityType: EntityType; label: string }> = {
    'gallery_attractions': { entityType: 'attraction', label: 'Atracción' },
    'gallery_events': { entityType: 'event', label: 'Evento' },
};

export const EntityStep = memo(function EntityStep({
    entityRequiredPlans,
    entitySelections,
    onSelectEntity,
}: EntityStepProps) {
    const colors = useThemedColors();

    const { data: attractions = [], isLoading: isLoadingAttractions } = useUserAttractions();
    const { data: events = [], isLoading: isLoadingEvents } = useUserEvents();

    const isLoading = isLoadingAttractions || isLoadingEvents;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                    Cargando tus publicaciones...
                </Text>
            </View>
        );
    }

    // Verificar si faltan entidades para algún plan
    const hasNoAttractions = entityRequiredPlans.includes('gallery_attractions') && attractions.length === 0;
    const hasNoEvents = entityRequiredPlans.includes('gallery_events') && events.length === 0;

    if (hasNoAttractions && hasNoEvents) {
        return (
            <View style={styles.emptyContainer}>
                <Compass size={48} color={colors.text.tertiary} />
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                    No tienes publicaciones
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                    Debes crear atracciones o eventos antes de poder comprar estos paquetes.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                Selecciona a qué publicación deseas aplicar cada paquete
            </Text>

            {entityRequiredPlans.map((planType) => {
                const plan = SUBSCRIPTION_PLANS.find(p => p.type === planType);
                const config = PLAN_ENTITY_CONFIG[planType];
                if (!plan || !config) return null;

                const entityList = config.entityType === 'attraction' ? attractions : events;
                const selectedEntity = entitySelections[planType];
                const EntityIcon = config.entityType === 'attraction' ? MapPin : Calendar;

                if (entityList.length === 0) {
                    return (
                        <View key={planType} style={[styles.planSection, { borderColor: colors.border.light }]}>
                            <View style={styles.planHeader}>
                                <ImagePlus size={20} color={colors.primary[500]} />
                                <Text style={[styles.planName, { color: colors.text.primary }]}>
                                    {plan.name}
                                </Text>
                            </View>
                            <View style={[styles.emptyPlanMessage, { backgroundColor: colors.background.tertiary }]}>
                                <Text style={[styles.emptyPlanText, { color: colors.text.tertiary }]}>
                                    No tienes {config.label.toLowerCase()}s. Crea {config.entityType === 'attraction' ? 'una' : 'uno'} primero.
                                </Text>
                            </View>
                        </View>
                    );
                }

                return (
                    <View key={planType} style={[styles.planSection, { borderColor: colors.border.light }]}>
                        <View style={styles.planHeader}>
                            <ImagePlus size={20} color={colors.primary[500]} />
                            <Text style={[styles.planName, { color: colors.text.primary }]}>
                                {plan.name}
                            </Text>
                        </View>
                        <Text style={[styles.planSubtitle, { color: colors.text.tertiary }]}>
                            Selecciona {config.entityType === 'attraction' ? 'la atracción' : 'el evento'}:
                        </Text>
                        <View style={styles.entityList}>
                            {entityList.map((entity: any) => {
                                const entityId = config.entityType === 'attraction' ? entity.id_atr : entity.id_evt;
                                const entityName = config.entityType === 'attraction' ? entity.name_atr : entity.name_evt;
                                const isSelected = selectedEntity?.entityId === entityId;

                                return (
                                    <Pressable
                                        key={entityId}
                                        style={[
                                            styles.entityCard,
                                            {
                                                backgroundColor: isSelected
                                                    ? colors.primary[500]
                                                    : colors.background.secondary,
                                                borderColor: isSelected ? colors.primary[500] : colors.border.medium,
                                            },
                                        ]}
                                        onPress={() => onSelectEntity(planType, entityId, config.entityType)}
                                    >
                                        <View style={styles.entityCardContent}>
                                            <EntityIcon
                                                size={18}
                                                color={isSelected ? '#FFFFFF' : colors.text.tertiary}
                                            />
                                            <Text
                                                style={[
                                                    styles.entityName,
                                                    { color: isSelected ? '#FFFFFF' : colors.text.primary },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {entityName}
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
