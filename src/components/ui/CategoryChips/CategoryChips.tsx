import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme } from '@/utils/categoryColors';
import { styles } from './styles';

export interface CategoryChipsProps {
    categoryNames: string[];
    categoryIds: string[];
    maxVisible?: number;
}

/**
 * Componente reutilizable para mostrar chips de categorías
 * Usado en: UserBusinessCard, UserEventCard, UserAttractionCard, UserProductCard
 */
export const CategoryChips = memo(function CategoryChips({
    categoryNames,
    categoryIds,
    maxVisible = 3,
}: CategoryChipsProps) {
    const colors = useThemedColors();

    if (categoryNames.length === 0) {
        return null;
    }

    return (
        <View style={styles.categoriesRow}>
            {categoryNames.slice(0, maxVisible).map((cat, idx) => {
                const categoryId = categoryIds[idx];
                const colorScheme = getCategoryColorScheme(categoryId);
                return (
                    <View
                        key={`${cat}-${idx}`}
                        style={[styles.categoryChip, { backgroundColor: colorScheme.backgroundColor }]}
                    >
                        <Text style={[styles.categoryText, { color: colorScheme.textColor }]}>
                            {cat}
                        </Text>
                    </View>
                );
            })}
            {categoryNames.length > maxVisible && (
                <View
                    style={[
                        styles.categoryChip,
                        { backgroundColor: colors.background.tertiary },
                    ]}
                >
                    <Text style={[styles.categoryText, { color: colors.text.secondary }]}>
                        +{categoryNames.length - maxVisible}
                    </Text>
                </View>
            )}
        </View>
    );
});
