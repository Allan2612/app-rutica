/**
 * FeaturedBusinesses Component
 * Section displaying featured businesses with top ratings
 * Supports location-based split: local items first, then others
 */

import { memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Store, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { splitItemsByLocation } from '@/utils/splitItemsByLocation';
import { LocationSectionHeader } from '@/components/ui/LocationSectionHeader';
import { NoLocalResultsPlaceholder } from '@/components/ui/NoLocalResultsPlaceholder';
import { BusinessCard } from '@/components/business';
import type { BusinessListItem } from '@/features/business/hooks/useBusinesses';
import { styles } from './styles';

interface FeaturedBusinessesProps {
    businesses: BusinessListItem[];
    isLoading?: boolean;
}

export const FeaturedBusinesses = memo(function FeaturedBusinesses({
    businesses,
    isLoading = false,
}: FeaturedBusinessesProps) {
    const colors = useThemedColors();
    const { location } = useLocationStore();

    const locationFilter = useMemo(() => {
        if (!location) return null;
        return { province: location.province, canton: location.canton, district: location.district };
    }, [location?.province, location?.canton, location?.district]);

    const { local, others, hasLocation, locationName } = useMemo(
        () => splitItemsByLocation(businesses, locationFilter),
        [businesses, locationFilter]
    );

    const handleBusinessPress = useCallback((business: BusinessListItem) => {
        router.push(`/(app)/(tabs)/businesses/${business.id}`);
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push('/(app)/(tabs)/businesses');
    }, []);

    const renderCarousel = (items: BusinessListItem[]) => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {items.map((business) => (
                <View key={business.id} style={styles.cardWrapper}>
                    <BusinessCard
                        id={business.id}
                        name={business.name}
                        categoryNames={business.categoryNames}
                        categoryIds={business.categoryIds}
                        locationLabel={business.locationLabel}
                        imageUrl={business.imageUrl}
                        logoUrl={business.logoUrl}
                        rating={business.rating}
                        reviewCount={business.reviewCount}
                        isApproved={business.isApproved}
                        hasActivePromotions={business.hasActivePromotions}
                        onPress={() => handleBusinessPress(business)}
                    />
                </View>
            ))}
        </ScrollView>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            {/* Section Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBadge, { backgroundColor: colors.primary[500] + '20' }]}>
                        <Store size={18} color={colors.primary[500]} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Comercios Destacados
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                            Los mejores negocios para ti
                        </Text>
                    </View>
                </View>
                {businesses.length > 0 && (
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
            ) : businesses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Store size={48} color={colors.text.tertiary} strokeWidth={1.5} />
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        No hay negocios disponibles
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
                                entityLabel="comercios"
                                compact
                            />
                            {renderCarousel(local)}
                        </>
                    )}

                    {/* Placeholder si no hay comercios locales */}
                    {local.length === 0 && others.length > 0 && (
                        <NoLocalResultsPlaceholder
                            locationName={locationName}
                            entityLabel="comercios"
                            compact
                        />
                    )}

                    {others.length > 0 && (
                        <>
                            <LocationSectionHeader
                                type="others"
                                count={others.length}
                                entityLabel="comercios"
                                compact
                            />
                            {renderCarousel(others)}
                        </>
                    )}
                </>
            ) : (
                /* Sin ubicación: mostrar todos en un solo carrusel */
                renderCarousel(businesses)
            )}
        </View>
    );
});
