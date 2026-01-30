import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedColors } from '@/hooks';
import { CategorySelector } from '@/components/ui';
import { CategoryOption } from '@/types/entities';
import { formSectionStyles as styles } from '@/styles/form-section-styles';

interface CategorySectionProps {
    categories: CategoryOption[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    isLoading?: boolean;
    error?: string;
}

export const CategorySection = memo(function CategorySection({
    categories,
    selectedIds,
    onSelectionChange,
    isLoading = false,
    error,
}: CategorySectionProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
                Categorías <Text style={styles.required}>*</Text>
            </Text>
            <CategorySelector
                categories={categories}
                selectedIds={selectedIds}
                onSelectionChange={onSelectionChange}
                isLoading={isLoading}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
});
