import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%',
    maxWidth: 600,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    flex: 1,
    minWidth: 100,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
  highlightCard: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 16,
    borderWidth: 1.5,
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
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  highlightReviewCount: {
    fontSize: typography.sizes.sm,
    marginLeft: spacing.xs,
  },
  chartCard: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  chartIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -0.5,
  },
  chartSubtitle: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xl,
    lineHeight: 20,
    opacity: 0.8,
  },
  chartContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
    overflow: 'hidden',
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
  },
  pieCenterLabel: {
    fontSize: typography.sizes.xs,
  },
  legendContainer: {
    flex: 1,
    marginLeft: spacing.lg,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: typography.sizes.xs,
  },
  legendValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
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
    marginBottom: 2,
  },
  businessReviewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessReviewRating: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  businessReviewCount: {
    fontSize: typography.sizes.xs,
  },
  miniRatingDistribution: {
    width: 50,
    gap: 2,
  },
  miniRatingBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  miniRatingFill: {
    height: '100%',
    borderRadius: 2,
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
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topProductRankText: {
    fontSize: typography.sizes.sm,
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
    gap: 4,
    marginBottom: 2,
  },
  topProductRatingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  topProductReviewCount: {
    fontSize: typography.sizes.xs,
  },
  recentReviewsList: {
    gap: spacing.sm,
  },
  recentReviewCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
  },
  recentReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  recentReviewType: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentReviewEntity: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  recentReviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  recentReviewComment: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  recentReviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentReviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentReviewAuthorName: {
    fontSize: typography.sizes.xs,
  },
  recentReviewDate: {
    fontSize: typography.sizes.xs,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.medium,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyDesc: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
