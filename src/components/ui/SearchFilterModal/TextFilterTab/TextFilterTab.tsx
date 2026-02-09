import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles, webStyles } from './styles';

interface TextFilterTabProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const TextFilterTab = memo(function TextFilterTab({
  value,
  onChange,
  placeholder = 'Buscar por nombre...',
  debounceMs = 200,
}: TextFilterTabProps) {
  const colors = useThemedColors();
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sincronizar valor externo
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Manejar cambio con debounce
  const handleChange = useCallback(
    (text: string) => {
      setLocalValue(text);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onChange(text);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text.secondary }]}>Buscar por nombre</Text>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.medium,
          },
        ]}
      >
        <Search size={20} color={colors.text.tertiary} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          value={localValue}
          onChangeText={handleChange}
          style={[styles.input, webStyles.inputWeb as object, { color: colors.text.primary }]}
          autoFocus={false}
          returnKeyType="search"
        />
        {localValue.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <X size={18} color={colors.text.tertiary} />
          </Pressable>
        )}
      </View>

      <Text style={[styles.hint, { color: colors.text.tertiary }]}>
        Escribe para filtrar por nombre o descripción
      </Text>
    </View>
  );
});
