import { memo, useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Calendar, Star, Users, Coins } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { formatEventDate, formatPrice } from '../helpers';
import { styles } from '../styles';

const MAX_VISIBLE_CATEGORIES = 3;

interface EventPostContentProps {
    name: string;
    description?: string | null;
    isApproved: boolean;
    categoryNames: string[];
    categoryIds: string[];
    startAt: string;
    endAt: string;
    isFree: boolean;
    price?: number | null;
    currency?: string | null;
    capacity?: number | null;
    rating: number;
    reviewCount: number;
}

export const EventPostContent = memo(function EventPostContent({
    name,
    description,
    isApproved,
    categoryNames,
    categoryIds,
    startAt,
    endAt,
    isFree,
    price,
    currency,
    capacity,
    rating,
    reviewCount,
}: EventPostContentProps) {
    const colors = useThemedColors();
    const [showAllCategories, setShowAllCategories] = useState(false);

    const eventDateLabel = formatEventDate(startAt, endAt);
    const priceLabel = formatPrice(isFree, price, currency);
    const categoriesToShow = showAllCategories ? categoryNames : categoryNames.slice(0, MAX_VISIBLE_CATEGORIES);
    const extraCategoriesCount = showAllCategories ? 0 : categoryNames.length - MAX_VISIBLE_CATEGORIES;

    return (
        <>
            {/* Título */}
            <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.text.primary }]}>{name}</Text>
                {isApproved && (
                    <Image
                        source={require('../../../../../assets/verification.png')}
                        style={{ width: 18, height: 18, marginLeft: 6 }}
                        resizeMode="contain"
                    />
                )}
            </View>

            {/* Descripción */}
            {description && (
                <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={3}>
                    {description}
                </Text>
            )}

            {/* Rating */}
            {rating > 0 && (
                <View style={styles.ratingRow}>
                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                    <Text style={[styles.ratingText, { color: colors.text.primary }]}>
                        {rating.toFixed(1)} ({reviewCount})
                    </Text>
                </View>
            )}

            {/* Categorías */}
            {categoryNames.length > 0 && (
                <View style={styles.categoriesRow}>
                    {categoriesToShow.map((catName, index) => {
                        const categoryId = categoryIds[index];
                        const colorScheme = getCategoryColorScheme(categoryId);
                        return (
                            <View
                                key={categoryId ?? index}
                                style={[styles.categoryChip, { backgroundColor: colorScheme.backgroundColor }]}
                            >
                                <Text style={[styles.categoryText, { color: colorScheme.textColor }]}>
                                    {catName}
                                </Text>
                            </View>
                        );
                    })}
                    {extraCategoriesCount > 0 && (
                        <Pressable
                            onPress={() => setShowAllCategories(true)}
                            style={[styles.categoryChip, { backgroundColor: colors.background.tertiary }]}
                        >
                            <Text style={[styles.categoryText, { color: colors.text.secondary }]}>
                                +{extraCategoriesCount}
                            </Text>
                        </Pressable>
                    )}
                </View>
            )}

            {/* Fecha */}
            <View style={styles.eventInfoRow}>
                <Calendar size={16} color={colors.primary[500]} />
                <Text style={[styles.eventInfoText, { color: colors.text.primary }]}>{eventDateLabel}</Text>
            </View>

            {/* Precio */}
            <View style={styles.eventInfoRow}>
                <Coins size={16} color={isFree ? '#10b981' : colors.primary[500]} />
                <Text style={[styles.eventInfoText, styles.priceText, { color: isFree ? '#10b981' : colors.text.primary }]}>
                    {priceLabel}
                </Text>
            </View>

            {/* Capacidad */}
            {capacity && capacity > 0 && (
                <View style={styles.eventInfoRow}>
                    <Users size={16} color={colors.primary[500]} />
                    <Text style={[styles.eventInfoText, { color: colors.text.primary }]}>
                        {capacity} cupos disponibles
                    </Text>
                </View>
            )}
        </>
    );
});
