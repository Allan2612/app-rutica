import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface FooterActionsProps {
  hasFilters: boolean;
  /** Cantidad de filtros activos, para el botón principal */
  activeCount?: number;
  onClear: () => void;
  onApply: () => void;
}

export const FooterActions = memo(function FooterActions({
  hasFilters,
  activeCount = 0,
  onClear,
  onApply,
}: FooterActionsProps) {
  const colors = useThemedColors();

  return (
    <View style={[styles.container, { borderTopColor: colors.border.light }]}>
      {hasFilters && (
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          style={[styles.clearButton, { borderColor: colors.border.medium }]}
        >
          <Text style={[styles.clearButtonText, { color: colors.text.secondary }]}>Limpiar</Text>
        </Pressable>
      )}
      <Pressable
        onPress={onApply}
        accessibilityRole="button"
        style={[styles.applyButton, { backgroundColor: colors.primary[500] }]}
      >
        <Text style={styles.applyButtonText}>
          {activeCount ? `Mostrar resultados (${activeCount} filtros)` : 'Mostrar resultados'}
        </Text>
      </Pressable>
    </View>
  );
});
