import { memo } from 'react';
import { Text } from 'react-native';
import { useThemedColors } from '@/hooks';

/**
 * Indica que un admin editó la reseña (L-07). La reseña sigue mostrando al autor original,
 * así que la edición tiene que ser visible.
 */
export const ModeratedBadge = memo(function ModeratedBadge({
  moderatedAt,
}: {
  moderatedAt?: string | null;
}) {
  const colors = useThemedColors();
  if (!moderatedAt) return null;
  return (
    <Text
      style={{ color: colors.text.tertiary, fontSize: 11, fontStyle: 'italic', marginTop: 2 }}
      accessibilityLabel="Reseña editada por moderación"
    >
      Editada por moderación
    </Text>
  );
});
