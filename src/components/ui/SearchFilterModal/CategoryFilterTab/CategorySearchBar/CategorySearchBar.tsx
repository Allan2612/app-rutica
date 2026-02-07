import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface CategorySearchBarProps {
    value: string;
    onChange: (text: string) => void;
    placeholder?: string;
}

export const CategorySearchBar = memo(function CategorySearchBar({
    value,
    onChange,
    placeholder = 'Busca una categoría...',
}: CategorySearchBarProps) {
    const colors = useThemedColors();
    const [localValue, setLocalValue] = useState(value);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = useCallback(
        (text: string) => {
            setLocalValue(text);

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                onChange(text);
            }, 200);
        },
        [onChange]
    );

    const handleClear = useCallback(() => {
        setLocalValue('');
        onChange('');
    }, [onChange]);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.medium,
                    },
                ]}
            >
                <Search size={18} color={colors.text.secondary} />
                <TextInput
                    style={[styles.input, { color: colors.text.primary }]}
                    value={localValue}
                    onChangeText={handleChange}
                    placeholder={placeholder}
                    placeholderTextColor={colors.text.tertiary}
                />
                {localValue.length > 0 && (
                    <Pressable onPress={handleClear} style={styles.clearButton}>
                        <X size={18} color={colors.text.secondary} />
                    </Pressable>
                )}
            </View>
        </View>
    );
});
