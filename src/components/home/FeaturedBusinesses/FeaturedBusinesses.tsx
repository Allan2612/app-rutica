/**
 * FeaturedBusinesses Component
 * Section displaying featured businesses with top ratings
 */

import { memo, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Store, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
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

    const handleBusinessPress = useCallback((business: BusinessListItem) => {
        router.push(`/(app)/(tabs)/businesses/${business.id}`);
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push('/(app)/(tabs)/businesses');
    }, []);

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
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {businesses.map((business) => (
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
            )}
        </View>
    );
});
