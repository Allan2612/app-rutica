import { memo } from 'react';
import { View, Text, Pressable, ViewStyle, TextStyle } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { getCategoryColorScheme, CategoryColorScheme } from '@/styles/theme/categoryColors';
import { styles } from './styles';

export interface CategoryChipProps {
    /** ID de la categoría (para obtener el color) */
    categoryId: string;
    /** Nombre a mostrar */
    categoryName: string;
    /** ID de la categoría padre (para subcategorías) */
    parentId?: string | null;
    /** Variante visual del chip */
    variant?: 'default' | 'small' | 'large';
    /** Si el chip es removible */
    removable?: boolean;
    /** Callback al presionar el botón de remover */
    onRemove?: () => void;
    /** Si el chip está seleccionado (para filtros) */
    selected?: boolean;
    /** Callback al presionar el chip */
    onPress?: () => void;
    /** Callback al presionar largo el chip */
    onLongPress?: () => void;
    /** Estilos personalizados para el contenedor */
    style?: ViewStyle;
    /** Estilos personalizados para el texto */
    textStyle?: TextStyle;
}

/**
 * Componente unificado para mostrar chips de categorías
 * Soporta múltiples variantes y es reutilizable en toda la app
 * 
 * Usado en:
 * - Cards de negocios, eventos, atracciones, productos
 * - Formularios de creación/edición
 * - Modal de filtros de categorías
 * - Promociones
 */
export const CategoryChip = memo(function CategoryChip({
    categoryId,
    categoryName,
    parentId,
    variant = 'default',
    removable = false,
    onRemove,
    selected = false,
    onPress,
    onLongPress,
    style,
    textStyle,
}: CategoryChipProps) {
    const colors = useThemedColors();
    const colorScheme = getCategoryColorScheme(categoryId, parentId);

    // Determinar estilos según variante
    const containerStyle = [
        variant === 'small' ? styles.chipSmall : 
        variant === 'large' ? styles.chipLarge : 
        styles.chip,
    ];

    const textStyleFinal = [
        variant === 'small' ? styles.textSmall : 
        variant === 'large' ? styles.textLarge : 
        styles.text,
    ];

    // Usar siempre los colores normales de la categoría (sin color especial para selección)
    const finalBackgroundColor = colorScheme.backgroundColor;
    const finalTextColor = colorScheme.textColor;
    const finalBorderColor = colorScheme.borderColor;

    const ChipContent = (
        <View
            style={[
                containerStyle,
                {
                    backgroundColor: finalBackgroundColor,
                    borderColor: finalBorderColor,
                },
                style,
            ]}
        >
            <Text
                style={[
                    textStyleFinal,
                    { color: finalTextColor },
                    textStyle,
                ]}
                numberOfLines={1}
                selectable={false}
            >
                {categoryName}
            </Text>
            {removable && onRemove && (
                <Pressable
                    onPress={onRemove}
                    hitSlop={8}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.6 : 1,
                        marginLeft: 4,
                    })}
                >
                    <X size={variant === 'small' ? 12 : 14} color={finalTextColor} strokeWidth={2.5} />
                </Pressable>
            )}
        </View>
    );

    // Si es clickeable, envolver en Pressable
    if (onPress || onLongPress) {
        return (
            <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                })}
            >
                {ChipContent}
            </Pressable>
        );
    }

    return ChipContent;
});
