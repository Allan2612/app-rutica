/**
 * FeaturedPromotions Component
 * Carousel section displaying active global promotions
 */

import { memo, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Tag, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { PromotionPublicCard } from '@/components/promotions';
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

    // Mostrar solo las primeras 5 promociones
    const displayedPromotions = promotions.slice(0, 5);

    const handlePromotionPress = useCallback((promotion: PromotionListItem) => {
        // Navegar al detalle del negocio que tiene la promoción
        if (promotion.businessId) {
            router.push(`/(app)/(tabs)/businesses/${promotion.businessId}`);
        }
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push('/(app)/(tabs)/businesses?tab=promotions');
    }, []);

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
            ) : displayedPromotions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Tag size={48} color={colors.text.tertiary} strokeWidth={1.5} />
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        No hay promociones disponibles
                    </Text>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {displayedPromotions.map((promotion) => (
                        <View key={promotion.id} style={styles.cardWrapper}>
                            <PromotionPublicCard
                                promotion={promotion}
                                onPress={handlePromotionPress}
                            />
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
});
