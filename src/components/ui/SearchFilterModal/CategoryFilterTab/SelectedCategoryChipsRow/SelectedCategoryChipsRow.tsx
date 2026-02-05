import { memo, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { HierarchicalCategoryOption } from '@/types/entities';
import { styles } from './styles';

interface SelectedCategoryChipsRowProps {
    selectedIds: string[];
    categoryById: Map<string, HierarchicalCategoryOption>;
    onRemove: (id: string) => void;
    onClearAll: () => void;
}

export const SelectedCategoryChipsRow = memo(function SelectedCategoryChipsRow({
    selectedIds,
    categoryById,
    onRemove,
    onClearAll,
}: SelectedCategoryChipsRowProps) {
    const colors = useThemedColors();

    if (selectedIds.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.scrollWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={Platform.OS === 'web'}
                    contentContainerStyle={styles.scrollContent}
                    style={Platform.OS === 'web' ? {
                        scrollbarWidth: 'thin',
                        scrollbarColor: `${colors.text.tertiary} ${colors.background.tertiary}`,
                    } as any : undefined}
                    // @ts-ignore
                    className={Platform.OS === 'web' ? 'category-scroll' : undefined}
                >
                {selectedIds.map((id) => {
                    const category = categoryById.get(id);
                    if (!category) return null;

                    return (
                        <View
                            key={id}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: colors.primary[500],
                                    borderColor: colors.primary[600],
                                },
                            ]}
                        >
                            <Text style={[styles.chipText, { color: colors.text.inverse }]}>
                                {category.name}
                            </Text>
                            <Pressable onPress={() => onRemove(id)} style={styles.removeButton}>
                                <X size={14} color={colors.text.inverse} />
                            </Pressable>
                        </View>
                    );
                })}
            </ScrollView>
            </View>
        </View>
    );
});
