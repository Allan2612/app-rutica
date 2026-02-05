import { memo } from 'react';
import { CategoryChipsContainer } from '../CategoryChipsContainer';

export interface CategoryChipsProps {
    categoryNames: string[];
    categoryIds: string[];
    maxVisible?: number;
}

/**
 * @deprecated Usar CategoryChipsContainer directamente
 * 
 * Componente legacy para mostrar chips de categorías
 * Mantiene compatibilidad con código existente
 */
export const CategoryChips = memo(function CategoryChips({
    categoryNames,
    categoryIds,
    maxVisible = 3,
}: CategoryChipsProps) {
    return (
        <CategoryChipsContainer
            categoryIds={categoryIds}
            categoryNames={categoryNames}
            maxVisible={maxVisible}
            variant="small"
            showCounter={true}
        />
    );
});
