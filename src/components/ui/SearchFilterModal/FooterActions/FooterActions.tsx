import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface FooterActionsProps {
  hasFilters: boolean;
  onClear: () => void;
  onApply: () => void;
}

export const FooterActions = memo(function FooterActions({
  hasFilters,
  onClear,
  onApply,
}: FooterActionsProps) {
  const colors = useThemedColors();

  return (
    <View style={[styles.container, { borderTopColor: colors.border.light }]}>
      {hasFilters && (
        <Pressable
          onPress={onClear}
          style={[styles.clearButton, { borderColor: colors.border.medium }]}
        >
          <Text style={[styles.clearButtonText, { color: colors.text.secondary }]}>Limpiar</Text>
        </Pressable>
      )}
      <Pressable
        onPress={onApply}
        style={[styles.applyButton, { backgroundColor: colors.primary[500] }]}
      >
        <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
      </Pressable>
    </View>
  );
});
