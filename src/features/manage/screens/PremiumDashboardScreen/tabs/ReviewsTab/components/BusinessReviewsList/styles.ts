import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  listSection: {
    width: '100%',
    maxWidth: 600,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.md,
  },
  businessReviewsList: {
    gap: spacing.sm,
  },
  businessReviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  businessReviewLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  businessReviewIconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessReviewInfo: {
    flex: 1,
  },
  businessReviewName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.xs,
  },
  businessReviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  businessReviewRating: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  businessReviewCount: {
    fontSize: typography.sizes.xs,
  },
  miniRatingDistribution: {
    gap: 2,
    width: 50,
  },
  miniRatingBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniRatingFill: {
    height: '100%',
    borderRadius: 2,
  },
});
