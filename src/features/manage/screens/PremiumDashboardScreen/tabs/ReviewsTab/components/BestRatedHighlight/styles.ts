import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  highlightCard: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 16,
    borderWidth: 2,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  highlightTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  highlightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  highlightLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  highlightIconPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightInfo: {
    flex: 1,
  },
  highlightName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  highlightRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  highlightRatingText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  highlightReviewCount: {
    fontSize: typography.sizes.sm,
  },
});
