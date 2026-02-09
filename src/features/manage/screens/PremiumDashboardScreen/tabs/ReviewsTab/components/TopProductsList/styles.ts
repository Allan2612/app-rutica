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
  topProductsList: {
    gap: spacing.sm,
  },
  topProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  topProductRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topProductRankText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: 2,
  },
  topProductBusiness: {
    fontSize: typography.sizes.xs,
  },
  topProductStats: {
    alignItems: 'flex-end',
  },
  topProductRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  topProductRatingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  topProductReviewCount: {
    fontSize: typography.sizes.xs,
  },
});
