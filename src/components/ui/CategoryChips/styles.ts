import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs - 2,
  },
  categoryChip: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
});
