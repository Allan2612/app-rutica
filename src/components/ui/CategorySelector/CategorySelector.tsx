import { memo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { spacing, typography } from '@/styles/theme';

export interface CategorySelectorProps {
    categories: Array<{ id: string; name: string }>;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    isLoading?: boolean;
}

export const CategorySelector = memo(function CategorySelector({
    categories,
    selectedIds,
    onSelectionChange,
    isLoading = false,
}: CategorySelectorProps) {
    const colors = useThemedColors();

    const toggleCategory = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((catId) => catId !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                    Cargando categorías...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {categories.map((category) => {
                const isSelected = selectedIds.includes(category.id);

                return (
                    <Pressable
                        key={category.id}
                        style={({ pressed }) => [
                            styles.chip,
                            {
                                backgroundColor: isSelected
                                    ? colors.primary[500]
                                    : colors.background.tertiary,
                                borderColor: isSelected ? colors.primary[600] : colors.border.medium,
                                opacity: pressed ? 0.7 : 1,
                            },
                        ]}
                        onPress={() => toggleCategory(category.id)}
                    >
                        {isSelected && (
                            <Check color="#fff" size={14} strokeWidth={2.5} />
                        )}
                        <Text
                            style={[
                                styles.chipText,
                                { color: isSelected ? '#fff' : colors.text.primary },
                            ]}
                        >
                            {category.name}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
});

const styles = StyleSheet.create({
    scrollContent: {
        gap: spacing.sm,
        paddingVertical: spacing.xs,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
        gap: spacing.xs,
    },
    chipText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    loadingContainer: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: typography.sizes.sm,
    },
});
