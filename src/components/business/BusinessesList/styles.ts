import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  cardWrapper: {
    marginBottom: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
    gap: spacing.md,
    minHeight: 300,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
