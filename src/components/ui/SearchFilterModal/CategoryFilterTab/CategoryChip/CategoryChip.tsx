import { memo } from 'react';
import { Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface CategoryChipProps {
    name: string;
    isSelected: boolean;
    isActive: boolean;
    onPress: () => void;
    onLongPress: () => void;
}

export const CategoryChip = memo(function CategoryChip({
    name,
    isSelected,
    isActive,
    onPress,
    onLongPress,
}: CategoryChipProps) {
    const colors = useThemedColors();

    let backgroundColor = colors.background.secondary;
    let borderColor = colors.border.medium;
    let textColor = colors.text.primary;

    if (isSelected) {
        backgroundColor = colors.primary[500];
        borderColor = colors.primary[600];
        textColor = colors.text.inverse;
    }

    const borderWidth = isActive ? 2 : 1;

    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
                styles.chip,
                {
                    backgroundColor,
                    borderColor,
                    borderWidth,
                    opacity: pressed ? 0.7 : 1,
                },
            ]}
        >
            <Text style={[styles.chipText, { color: textColor }]} numberOfLines={1}>
                {name}
            </Text>
        </Pressable>
    );
});
