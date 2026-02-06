/**
 * FeaturedPromotions Component
 * Carousel section displaying active global promotions
 */

import { memo, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Tag, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { PromotionPublicCard } from '@/components/promotions';
import { GenericCarousel } from '@/components/ui';
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
    console.log('[FeaturedPromotions] Rendering with:', { 
        promotionsCount: promotions.length, 
        isLoading,
        promotions: promotions.map(p => ({ id: p.id, title: p.title, categoryNames: p.categoryNames, scopeCategoryIds: p.scopeCategoryIds }))
    });
    
    const colors = useThemedColors();
    const { width } = useWindowDimensions();

    const isMobile = width < 768;

    const handlePromotionPress = useCallback((promotion: PromotionListItem) => {
        // Navegar al detalle del negocio que tiene la promoción
        if (promotion.businessId) {
            router.push(`/(app)/(tabs)/businesses/${promotion.businessId}`);
        }
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push('/(app)/(tabs)/businesses?tab=promotions');
    }, []);

    const renderPromotionItem = useCallback((promotion: PromotionListItem) => {
        console.log('[FeaturedPromotions] renderItem called for:', promotion.id);
        try {
            return (
                <PromotionPublicCard
                    promotion={promotion}
                    onPress={handlePromotionPress}
                />
            );
        } catch (error) {
            console.error('[FeaturedPromotions] Error rendering card:', error);
            return null;
        }
    }, [handlePromotionPress]);

    // Don't render if no promotions and not loading
    if (!isLoading && promotions.length === 0) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            {/* Section Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBadge, { backgroundColor: colors.promo.badge + '20' }]}>
                        <Tag size={18} color={colors.promo.badge} strokeWidth={2} />
                    </View>
                    <View>
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
            ) : (
                <View style={styles.carouselContainer}>
                    <GenericCarousel
                        items={promotions}
                        renderItem={renderPromotionItem}
                        showNavigation={!isMobile && promotions.length > 1}
                        showIndicators={promotions.length > 1}
                        autoScroll={promotions.length > 1}
                        autoScrollInterval={5000}
                    />
                </View>
            )}
        </View>
    );
});
