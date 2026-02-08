/**
 * FeaturedPromotions Component
 * Carousel section displaying active global promotions
 * Splits into local/other sections when a location filter is active
 */

import { memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Tag, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import { PromotionPublicCard } from '@/components/promotions';
import { LocationSectionHeader } from '@/components/ui/LocationSectionHeader';
import { NoLocalResultsPlaceholder } from '@/components/ui/NoLocalResultsPlaceholder';
import { splitItemsByLocation } from '@/utils/splitItemsByLocation';
import type { PromotionListItem } from '@/types/entities';
import { styles } from './styles';

interface FeaturedPromotionsProps {
    promotions: PromotionListItem[];
    isLoading?: boolean;
}

export const FeaturedPromotions = memo(function FeaturedPromotions({
    promotions,
    isLoading = false,
}: FeaturedPromotionsProps) {
    const colors = useThemedColors();
    const { location } = useLocationStore();

    // Dividir por ubicación del negocio asociado
    const locationFilter = useMemo(() => {
        if (!location) return null;
        return { province: location.province, canton: location.canton, district: location.district };
    }, [location?.province, location?.canton, location?.district]);

    const split = useMemo(
        () => splitItemsByLocation(promotions, locationFilter),
        [promotions, locationFilter]
    );

    const handlePromotionPress = useCallback((promotion: PromotionListItem) => {
        if (promotion.businessId) {
            router.push(`/(app)/(tabs)/businesses/${promotion.businessId}`);
        }
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push('/(app)/(tabs)/businesses?tab=promotions');
    }, []);

    const renderHorizontalList = (items: PromotionListItem[]) => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {items.slice(0, 5).map((promotion) => (
                <View key={promotion.id} style={styles.cardWrapper}>
                    <PromotionPublicCard
                        promotion={promotion}
                        onPress={handlePromotionPress}
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
                    <View style={[styles.iconBadge, { backgroundColor: colors.promo.badge + '20' }]}>
                        <Tag size={18} color={colors.promo.badge} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Ofertas Destacadas
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                            Las mejores promociones del momento
                        </Text>
                    </View>
                </View>
                {promotions.length > 0 && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.seeAllButton,
                            { opacity: pressed ? 0.7 : 1 },
                        ]}
                        onPress={handleSeeAll}
                    >
                        <Text style={[styles.seeAllText, { color: colors.primary[500] }]}>
                            Ver todas
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
            ) : promotions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Tag size={48} color={colors.text.tertiary} strokeWidth={1.5} />
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        No hay promociones disponibles
                    </Text>
                </View>
            ) : !split.hasLocation ? (
                renderHorizontalList(promotions)
            ) : (
                <View>
                    {/* Ofertas en la ubicación seleccionada */}
                    {split.local.length > 0 && (
                        <>
                            <LocationSectionHeader
                                type="local"
                                locationName={split.locationName}
                                count={split.local.length}
                                entityLabel="ofertas"
                                compact
                            />
                            {renderHorizontalList(split.local)}
                        </>
                    )}

                    {/* Placeholder si no hay ofertas locales */}
                    {split.local.length === 0 && split.others.length > 0 && (
                        <NoLocalResultsPlaceholder
                            locationName={split.locationName}
                            entityLabel="ofertas"
                            compact
                        />
                    )}

                    {/* Ofertas de otros lugares */}
                    {split.others.length > 0 && (
                        <>
                            <LocationSectionHeader
                                type="others"
                                count={split.others.length}
                                entityLabel="ofertas"
                                compact
                            />
                            {renderHorizontalList(split.others)}
                        </>
                    )}
                </View>
            )}
        </View>
    );
});
