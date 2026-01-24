import { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MapPin, Star, ExternalLink } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { styles } from './styles';

interface AttractionHeaderProps {
    name: string;
    description: string | null;
    categoryIds: string[];
    categoryNames: string[];
    rating: number;
    reviewCount: number;
    locationLabel: string | null;
    latitude: number | null;
    longitude: number | null;
    onOpenMaps: () => void;
}

export const AttractionHeader = memo(({
    name,
    description,
    categoryIds,
    categoryNames,
    rating,
    reviewCount,
    locationLabel,
    latitude,
    longitude,
    onOpenMaps,
}: AttractionHeaderProps) => {
    const colors = useThemedColors();
    const [expandedDescription, setExpandedDescription] = useState(false);

    const shouldTruncate = description && description.length > 200;
    const displayDescription = shouldTruncate && !expandedDescription
        ? `${description.substring(0, 200)}...`
        : description;

    return (
        <>
            {/* Categories */}
            <View style={styles.categoriesRow}>
                {categoryNames.map((catName, idx) => {
                    const catId = categoryIds[idx];
                    const colorScheme = getCategoryColorScheme(catId);
                    return (
                        <View key={catId} style={[styles.categoryBadge, { backgroundColor: colorScheme.backgroundColor }]}>
                            <Text style={[styles.categoryText, { color: colorScheme.textColor }]}>{catName}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text.primary }]}>{name}</Text>

            {/* Description */}
            {description && (
                <View style={styles.descriptionSection}>
                    <Text style={[styles.descriptionText, { color: colors.text.secondary }]}>
                        {displayDescription}
                    </Text>
                    {shouldTruncate && (
                        <Pressable onPress={() => setExpandedDescription(!expandedDescription)}>
                            <Text style={[styles.readMoreText, { color: colors.primary[500] }]}>
                                {expandedDescription ? 'Ver menos' : 'Ver más'}
                            </Text>
                        </Pressable>
                    )}
                </View>
            )}

            {/* Rating */}
            {rating > 0 && (
                <View style={styles.ratingRow}>
                    <Star size={16} color="#facc15" fill="#facc15" />
                    <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
                        {rating.toFixed(1)} ({reviewCount} reseñas)
                    </Text>
                </View>
            )}

            {/* Location */}
            {locationLabel && (
                <Pressable style={styles.locationRow} onPress={onOpenMaps}>
                    <MapPin size={16} color={colors.primary[500]} />
                    <Text style={[styles.locationText, { color: colors.text.secondary }]}>
                        {locationLabel}
                    </Text>
                    {latitude && longitude && (
                        <ExternalLink size={14} color={colors.primary[500]} />
                    )}
                </Pressable>
            )}
        </>
    );
});

AttractionHeader.displayName = 'AttractionHeader';
