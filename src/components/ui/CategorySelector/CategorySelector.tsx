import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

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
        <View style={styles.container}>
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
        </View>
    );
});
