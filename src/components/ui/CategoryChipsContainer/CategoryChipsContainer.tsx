import { memo } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { CategoryChip } from '../CategoryChip';
import { styles } from './styles';

export interface CategoryChipsContainerProps {
    /** Array de IDs de categorías */
    categoryIds: string[];
    /** Array de nombres de categorías (mismo orden que IDs) */
    categoryNames: string[];
    /** Array de IDs de padres (opcional, para subcategorías) */
    parentIds?: (string | null)[];
    /** Variante visual */
    variant?: 'default' | 'small' | 'large';
    /** Número máximo de chips visibles */
    maxVisible?: number;
    /** Si los chips son removibles */
    removable?: boolean;
    /** Callback al remover un chip */
    onRemove?: (categoryId: string) => void;
    /** Callback al presionar un chip */
    onPress?: (categoryId: string) => void;
    /** Estilos personalizados para el contenedor */
    style?: ViewStyle;
    /** Mostrar contador de items adicionales */
    showCounter?: boolean;
}

/**
 * Contenedor para mostrar múltiples chips de categorías
 * con scroll horizontal o wrap
 */
export const CategoryChipsContainer = memo(function CategoryChipsContainer({
    categoryIds,
    categoryNames,
    parentIds,
    variant = 'default',
    maxVisible,
    removable = false,
    onRemove,
    onPress,
    style,
    showCounter = true,
}: CategoryChipsContainerProps) {
    if (categoryIds.length === 0 || categoryNames.length === 0) {
        return null;
    }

    const visibleCount = maxVisible ?? categoryIds.length;
    const hasMore = categoryIds.length > visibleCount;
    const remainingCount = categoryIds.length - visibleCount;

    return (
        <View style={[styles.container, style]}>
            {categoryIds.slice(0, visibleCount).map((id, index) => (
                <CategoryChip
                    key={id}
                    categoryId={id}
                    categoryName={categoryNames[index]}
                    parentId={parentIds?.[index]}
                    variant={variant}
                    removable={removable}
                    onRemove={onRemove ? () => onRemove(id) : undefined}
                    onPress={onPress ? () => onPress(id) : undefined}
                />
            ))}
            {hasMore && showCounter && (
                <View
                    style={[
                        variant === 'small'
                            ? styles.counterSmall
                            : variant === 'large'
                            ? styles.counterLarge
                            : styles.counter,
                    ]}
                >
                    <Text
                        style={[
                            variant === 'small'
                                ? styles.counterTextSmall
                                : variant === 'large'
                                ? styles.counterTextLarge
                                : styles.counterText,
                        ]}
                    >
                        +{remainingCount}
                    </Text>
                </View>
            )}
        </View>
    );
});
