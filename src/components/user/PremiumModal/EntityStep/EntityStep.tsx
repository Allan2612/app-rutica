import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { MapPin, Calendar, Check, Compass } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useUserAttractions } from '@/features/attractions/hooks';
import { useUserEvents } from '@/features/events/hooks';
import { SUBSCRIPTION_PLANS } from '@/types/entities';
import type { SubscriptionType } from '@/types/enums';
import { styles } from './styles';

type EntityType = 'attraction' | 'event';

interface EntityStepProps {
    selectedPlans: SubscriptionType[];
    selectedEntityId: string | null;
    selectedEntityType: EntityType | null;
    onSelectEntity: (entityId: string, entityType: EntityType) => void;
}

export const EntityStep = memo(function EntityStep({
    selectedPlans,
    selectedEntityId,
    selectedEntityType,
    onSelectEntity,
}: EntityStepProps) {
    const colors = useThemedColors();

    // Determinar qué tipo de entidades mostrar según el plan seleccionado
    const isGalleryAttractions = selectedPlans.includes('gallery_attractions');
    const isGalleryEvents = selectedPlans.includes('gallery_events');
    const entityTypeToShow: EntityType = isGalleryEvents ? 'event' : 'attraction';

    const { data: attractions = [], isLoading: isLoadingAttractions } = useUserAttractions();
    const { data: events = [], isLoading: isLoadingEvents } = useUserEvents();

    const isLoading = isGalleryAttractions ? isLoadingAttractions : isLoadingEvents;

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
                    Cargando tus publicaciones...
                </Text>
            </View>
        );
    }

    const entityList = entityTypeToShow === 'attraction' ? attractions : events;
    const entityLabel = entityTypeToShow === 'attraction' ? 'atracciones' : 'eventos';
    const EntityIcon = entityTypeToShow === 'attraction' ? MapPin : Calendar;

    if (entityList.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Compass size={48} color={colors.text.tertiary} />
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                    No tienes {entityLabel}
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                    Debes crear {entityTypeToShow === 'attraction' ? 'una atracción' : 'un evento'} antes de poder comprar este paquete.
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
                Selecciona la publicación a la que deseas aplicar este paquete
            </Text>

            {/* Lista de entidades */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {entityList.map((entity: any) => {
                    const entityId = entityTypeToShow === 'attraction' ? entity.id_atr : entity.id_evt;
                    const entityName = entityTypeToShow === 'attraction' ? entity.name_atr : entity.name_evt;
                    const isSelected = selectedEntityId === entityId && selectedEntityType === entityTypeToShow;

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
                            onPress={() => onSelectEntity(entityId, entityTypeToShow)}
                        >
                            <View style={styles.entityCardContent}>
                                <EntityIcon
                                    size={20}
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
                                {isSelected && <Check size={20} color="#FFFFFF" />}
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
});
