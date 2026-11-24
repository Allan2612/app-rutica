/**
 * LoadMoreButton
 * Pie de lista paginada (5.14): botón "Ver más" o indicador mientras carga la página.
 * No renderiza nada cuando no hay más páginas.
 */

import { memo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useThemedColors } from '@/hooks';
import { spacing } from '@/styles/theme';

interface LoadMoreButtonProps {
  hasMore?: boolean;
  isLoading?: boolean;
  onPress: () => void;
  /** Ej. "comercios": se lee como "Ver más comercios" */
  entityLabel?: string;
}

export const LoadMoreButton = memo(function LoadMoreButton({
  hasMore,
  isLoading,
  onPress,
  entityLabel,
}: LoadMoreButtonProps) {
  const colors = useThemedColors();
  if (!hasMore && !isLoading) return null;

  const label = entityLabel ? `Ver más ${entityLabel}` : 'Ver más';
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary[600]} accessibilityLabel="Cargando" />
      ) : (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={({ pressed }) => ({
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.primary[500],
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={{ color: colors.primary[600], fontWeight: '600', fontSize: 14 }}>{label}</Text>
        </Pressable>
      )}
    </View>
  );
});
