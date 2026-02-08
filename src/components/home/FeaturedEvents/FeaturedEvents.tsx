/**
 * FeaturedEvents Component
 * Section displaying upcoming featured events
 * Supports location-based split: local items first, then others
 */

import { memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Calendar, ChevronRight, MapPin, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { splitItemsByLocation } from '@/utils/splitItemsByLocation';
import { LocationSectionHeader } from '@/components/ui/LocationSectionHeader';
import { NoLocalResultsPlaceholder } from '@/components/ui/NoLocalResultsPlaceholder';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { formatDate, DATE_FORMAT_OPTIONS } from '@/utils';
import type { EventListItem } from '@/features/events/hooks/useEvents';
import { styles } from './styles';

interface FeaturedEventsProps {
    events: EventListItem[];
    isLoading?: boolean;
}

export const FeaturedEvents = memo(function FeaturedEvents({
    events,
    isLoading = false,
}: FeaturedEventsProps) {
    const colors = useThemedColors();
    const { location } = useLocationStore();

    const locationFilter = useMemo(() => {
        if (!location) return null;
        return { province: location.province, canton: location.canton, district: location.district };
    }, [location?.province, location?.canton, location?.district]);

    const { local, others, hasLocation, locationName } = useMemo(
        () => splitItemsByLocation(events, locationFilter),
        [events, locationFilter]
    );

    const handleEventPress = useCallback((event: EventListItem) => {
        router.push(`/(app)/(tabs)/events/${event.id}`);
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push('/(app)/(tabs)/events');
    }, []);

    const renderCard = (event: EventListItem) => (
        <Pressable 
            key={event.id} 
            style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}
            onPress={() => handleEventPress(event)}
        >
            {event.imageUrls[0] ? (
                <Image source={{ uri: event.imageUrls[0] }} style={styles.heroFull} resizeMode="cover" />
            ) : (
                <View style={[styles.heroFull, styles.heroPlaceholder, { backgroundColor: colors.background.tertiary }]}>
                    <Calendar size={40} color={colors.text.tertiary} strokeWidth={1.5} />
                </View>
            )}

            {event.rating > 0 && (
                <View style={[styles.ratingBadge, { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: colors.border.medium }]}>
                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.ratingValue}>{event.rating.toFixed(1)}</Text>
                    <Text style={[styles.ratingCount, { color: colors.text.tertiary }]}>({event.reviewCount})</Text>
                </View>
            )}

            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientOverlay}
            />

            <View style={styles.content}>
                {event.categoryNames.length > 0 && (
                    <View style={styles.categoryRow}>
                        <CategoryChip
                            categoryId={event.categoryIds[0]}
                            categoryName={event.categoryNames[0]}
                            variant="small"
                        />
                        {event.categoryNames.length > 1 && (
                            <View style={[styles.categoryChip, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                                <Text style={[styles.categoryText, { color: '#FFFFFF' }]}>
                                    +{event.categoryNames.length - 1}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <Text style={styles.title} numberOfLines={2}>
                    {event.name}
                </Text>

                <View style={styles.infoRow}>
                    <Calendar size={14} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                    <Text style={styles.infoText}>
                        {formatDate(event.startAt, DATE_FORMAT_OPTIONS.dayMonthShort)}
                    </Text>
                </View>

                {event.locationLabel && (
                    <View style={styles.infoRow}>
                        <MapPin size={14} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                        <Text style={styles.infoText} numberOfLines={1}>
                            {event.locationLabel}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );

    const renderCarousel = (items: EventListItem[]) => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {items.map(renderCard)}
        </ScrollView>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            {/* Section Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBadge, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.15)' }]}>
                        <Calendar size={18} color={colors.isDark ? '#fb923c' : '#f97316'} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Eventos Próximos
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                            No te pierdas estos eventos
                        </Text>
                    </View>
                </View>
                {events.length > 0 && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.seeAllButton,
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={handleSeeAll}
                    >
                        <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>
                            Ver todos
                        </Text>
                        <ChevronRight size={16} color={colors.primary[500]} strokeWidth={2} />
                    </Pressable>
                )}
            </View>

            {/* Content */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            ) : events.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Calendar size={48} color={colors.text.tertiary} strokeWidth={1.5} />
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        No hay eventos próximos disponibles
                    </Text>
                </View>
            ) : hasLocation ? (
                /* Split por ubicación */
                <>
                    {local.length > 0 && (
                        <>
                            <LocationSectionHeader
                                type="local"
                                locationName={locationName}
                                count={local.length}
                                entityLabel="eventos"
                                compact
                            />
                            {renderCarousel(local)}
                        </>
                    )}

                    {/* Placeholder si no hay eventos locales */}
                    {local.length === 0 && others.length > 0 && (
                        <NoLocalResultsPlaceholder
                            locationName={locationName}
                            entityLabel="eventos"
                            compact
                        />
                    )}

                    {others.length > 0 && (
                        <>
                            <LocationSectionHeader
                                type="others"
                                count={others.length}
                                entityLabel="eventos"
                                compact
                            />
                            {renderCarousel(others)}
                        </>
                    )}
                </>
            ) : (
                /* Sin ubicación: mostrar todos en un solo carrusel */
                renderCarousel(events)
            )}
        </View>
    );
});
