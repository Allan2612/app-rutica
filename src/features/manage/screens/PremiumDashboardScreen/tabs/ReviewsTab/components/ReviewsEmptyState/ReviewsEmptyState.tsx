import { memo } from 'react';
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import { styles } from './styles';
import type { ThemedColors } from '../../../../../../../../types/entities/premium';

interface ReviewsEmptyStateProps {
  colors: ThemedColors;
}

export const ReviewsEmptyState = memo(function ReviewsEmptyState({
  colors,
}: ReviewsEmptyStateProps) {
  return (
    <View
      style={[
        styles.emptyCard,
        { backgroundColor: colors.background.primary, borderColor: colors.border.light },
      ]}
    >
      <Star color={colors.text.tertiary} size={40} strokeWidth={1.5} />
      <Text style={[styles.emptyTitle, { color: colors.text.secondary }]}>Sin reseñas todavía</Text>
      <Text style={[styles.emptyDesc, { color: colors.text.tertiary }]}>
        Cuando los usuarios dejen reseñas en tus negocios o productos, verás las estadísticas aquí.
      </Text>
    </View>
  );
});
