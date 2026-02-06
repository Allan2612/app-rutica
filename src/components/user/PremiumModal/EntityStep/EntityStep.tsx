import { memo, useState } from 'react';
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
    const [activeTab, setActiveTab] = useState<EntityType>('attraction');

    const { data: attractions = [], isLoading: isLoadingAttractions } = useUserAttractions();
    const { data: events = [], isLoading: isLoadingEvents } = useUserEvents();

    const isLoading = isLoadingAttractions || isLoadingEvents;

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

    const hasAttractions = attractions.length > 0;
    const hasEvents = events.length > 0;
    const hasNoEntities = !hasAttractions && !hasEvents;

    if (hasNoEntities) {
        return (
            <View style={styles.emptyContainer}>
                <Compass size={48} color={colors.text.tertiary} />
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                    No tienes publicaciones
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                    Debes crear una atracción o evento antes de poder comprar este paquete.
                </Text>
            </View>
        );
    }

    const currentList = activeTab === 'attraction' ? attractions : events;
    const isEmpty = currentList.length === 0;

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

            {/* Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: colors.background.tertiary }]}>
                <Pressable
                    style={[
                        styles.tab,
                        {
                            backgroundColor: activeTab === 'attraction'
                                ? colors.primary[500]
                                : 'transparent',
                        },
                    ]}
                    onPress={() => setActiveTab('attraction')}
                >
                    <MapPin
                        size={16}
                        color={activeTab === 'attraction' ? '#FFFFFF' : colors.text.secondary}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'attraction' ? '#FFFFFF' : colors.text.secondary },
                    ]}>
                        Atracciones ({attractions.length})
                    </Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.tab,
                        {
                            backgroundColor: activeTab === 'event'
                                ? colors.primary[500]
                                : 'transparent',
                        },
                    ]}
                    onPress={() => setActiveTab('event')}
                >
                    <Calendar
                        size={16}
                        color={activeTab === 'event' ? '#FFFFFF' : colors.text.secondary}
                    />
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === 'event' ? '#FFFFFF' : colors.text.secondary },
                    ]}>
                        Eventos ({events.length})
                    </Text>
                </Pressable>
            </View>

            {/* Lista de entidades */}
            {isEmpty ? (
                <View style={styles.emptyContainer}>
                    {activeTab === 'attraction' ? (
                        <MapPin size={40} color={colors.text.tertiary} />
                    ) : (
                        <Calendar size={40} color={colors.text.tertiary} />
                    )}
                    <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                        No tienes {activeTab === 'attraction' ? 'atracciones' : 'eventos'}
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                        Cambia de pestaña o crea {activeTab === 'attraction' ? 'una atracción' : 'un evento'} primero.
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {currentList.map((entity: any) => {
                        // Las atracciones usan id_atr/name_atr, los eventos usan id_evt/name_evt
                        const entityId = activeTab === 'attraction' ? entity.id_atr : entity.id_evt;
                        const entityName = activeTab === 'attraction' ? entity.name_atr : entity.name_evt;
                        const isSelected = selectedEntityId === entityId && selectedEntityType === activeTab;

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
                                onPress={() => onSelectEntity(entityId, activeTab)}
                            >
                                <View style={styles.entityCardContent}>
                                    {activeTab === 'attraction' ? (
                                        <MapPin
                                            size={20}
                                            color={isSelected ? '#FFFFFF' : colors.text.tertiary}
                                        />
                                    ) : (
                                        <Calendar
                                            size={20}
                                            color={isSelected ? '#FFFFFF' : colors.text.tertiary}
                                        />
                                    )}
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
            )}
        </View>
    );
});
