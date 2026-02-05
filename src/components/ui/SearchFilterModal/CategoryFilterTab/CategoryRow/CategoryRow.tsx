import { memo } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { HierarchicalCategoryOption } from '@/types/entities';
import { CategoryChip } from '../CategoryChip';
import { styles } from './styles';

interface CategoryRowProps {
    title: string;
    categories: HierarchicalCategoryOption[];
    activeId: string | null;
    selectedIds: string[];
    onSelect: (id: string) => void;
    onToggleSelection: (id: string) => void;
}

export const CategoryRow = memo(function CategoryRow({
    title,
    categories,
    activeId,
    selectedIds,
    onSelect,
    onToggleSelection,
}: CategoryRowProps) {
    const colors = useThemedColors();

    if (categories.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text.secondary }]}>
                {title}
            </Text>
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
                {categories.map((category) => {
                    const isSelected = selectedIds.includes(category.id);
                    const isActive = activeId === category.id;

                    return (
                        <CategoryChip
                            key={category.id}
                            name={category.name}
                            isSelected={isSelected}
                            isActive={isActive}
                            onPress={() => {
                                // Click simple: selecciona Y navega
                                onToggleSelection(category.id);
                                onSelect(category.id);
                            }}
                            onLongPress={() => {
                                // Long press: solo navega sin seleccionar
                                onSelect(category.id);
                            }}
                        />
                    );
                })}
            </ScrollView>
            </View>
        </View>
    );
});
