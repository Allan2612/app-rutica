/**
 * FeaturedAttractions Component
 * Section displaying top-rated featured attractions
 */

import { memo, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Mountain, ChevronRight, MapPin, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { CategoryChip } from '@/components/ui/CategoryChip';
import type { AttractionListItem } from '@/features/attractions/hooks/useAttractions';
import { styles } from './styles';

interface FeaturedAttractionsProps {
    attractions: AttractionListItem[];
    isLoading?: boolean;
}

export const FeaturedAttractions = memo(function FeaturedAttractions({
    attractions,
    isLoading = false,
}: FeaturedAttractionsProps) {
    const colors = useThemedColors();

    const handleAttractionPress = useCallback((attraction: AttractionListItem) => {
        router.push(`/(app)/(tabs)/attractions/${attraction.id}`);
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push('/(app)/(tabs)/attractions');
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            {/* Section Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <View style={[styles.iconBadge, { backgroundColor: colors.isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)' }]}>
                        <MapPin size={18} color={colors.isDark ? '#4ade80' : '#22c55e'} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                            Atracciones Destacadas
                        </Text>
                        <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                            Lugares que debes conocer
                        </Text>
                    </View>
                </View>
                {attractions.length > 0 && (
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
            ) : attractions.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MapPin size={48} color={colors.text.tertiary} strokeWidth={1.5} />
                    <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                        No hay atracciones disponibles
                    </Text>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {attractions.map((attraction) => (
                        <Pressable
                            key={attraction.id}
                            style={[styles.card, { backgroundColor: colors.background.primary, borderColor: colors.border.medium }]}
                            onPress={() => handleAttractionPress(attraction)}
                        >
                            {attraction.imageUrls[0] ? (
                                <Image source={{ uri: attraction.imageUrls[0] }} style={styles.heroFull} resizeMode="cover" />
                            ) : (
                                <View style={[styles.heroFull, styles.heroPlaceholder, { backgroundColor: colors.background.tertiary }]}>
                                    <Mountain size={40} color={colors.text.tertiary} strokeWidth={1.5} />
                                </View>
                            )}

                            {attraction.rating > 0 && (
                                <View style={[styles.ratingBadge, { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: colors.border.medium }]}>
                                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                                    <Text style={styles.ratingValue}>{attraction.rating.toFixed(1)}</Text>
                                    <Text style={[styles.ratingCount, { color: colors.text.tertiary }]}>({attraction.reviewCount})</Text>
                                </View>
                            )}

                            <LinearGradient
                                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.gradientOverlay}
                            />

                            <View style={styles.content}>
                                {attraction.categoryNames.length > 0 && (
                                    <View style={styles.categoryRow}>
                                        <CategoryChip
                                            categoryId={attraction.categoryIds[0]}
                                            categoryName={attraction.categoryNames[0]}
                                            variant="small"
                                        />
                                        {attraction.categoryNames.length > 1 && (
                                            <View style={[styles.categoryChip, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                                                <Text style={[styles.categoryText, { color: '#FFFFFF' }]}>
                                                    +{attraction.categoryNames.length - 1}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                <Text style={styles.title} numberOfLines={2}>
                                    {attraction.name}
                                </Text>

                                {attraction.description && (
                                    <Text style={styles.description} numberOfLines={2}>
                                        {attraction.description}
                                    </Text>
                                )}

                                {attraction.locationLabel && (
                                    <View style={styles.infoRow}>
                                        <MapPin size={14} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                                        <Text style={styles.infoText} numberOfLines={1}>
                                            {attraction.locationLabel}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            )}
        </View>
    );
});
