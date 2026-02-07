import { memo } from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { useThemedColors } from '@/hooks';
import { CategoryChip } from '@/components/ui';
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
                    style={
                        Platform.OS === 'web'
                            ? ({
                                  scrollbarWidth: 'thin',
                                  scrollbarColor: `${colors.text.tertiary} ${colors.background.tertiary}`,
                              } as any)
                            : undefined
                    }
                    // @ts-ignore
                    className={Platform.OS === 'web' ? 'category-scroll' : undefined}
                >
                    {selectedIds.map((id) => {
                        const category = categoryById.get(id);
                        if (!category) return null;

                        return (
                            <CategoryChip
                                key={id}
                                categoryId={id}
                                categoryName={category.name}
                                parentId={category.parentId}
                                variant="default"
                                removable={true}
                                onRemove={() => onRemove(id)}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
});
