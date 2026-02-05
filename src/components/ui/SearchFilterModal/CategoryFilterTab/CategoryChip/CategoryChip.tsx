import { memo } from 'react';
import { Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { CategoryChip as BaseCategoryChip } from '@/components/ui';
import { styles } from './styles';

interface CategoryChipProps {
    categoryId: string;
    name: string;
    parentId?: string | null;
    isSelected: boolean;
    isActive: boolean;
    onPress: () => void;
    onLongPress: () => void;
}

/**
 * Chip de categoría especializado para el modal de filtros
 * Soporta navegación (isActive) y selección
 */
export const CategoryChip = memo(function CategoryChip({
    categoryId,
    name,
    parentId,
    isSelected,
    isActive,
    onPress,
    onLongPress,
}: CategoryChipProps) {
    const colors = useThemedColors();

    // Determinar el borde según si está activo (navegado)
    const borderWidth = isActive ? 2 : 1;
    const borderColor = isActive ? colors.primary[400] : undefined;

    // Combinar onPress y onLongPress en un solo handler
    const handlePress = () => {
        onPress();
    };

    const handleLongPress = () => {
        onLongPress();
    };

    return (
        <BaseCategoryChip
            categoryId={categoryId}
            categoryName={name}
            parentId={parentId}
            variant="default"
            selected={isSelected}
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={{ borderWidth, ...(borderColor ? { borderColor } : {}) }}
        />
    );
});
