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
    gap: 1,
  },
  recentReviewComment: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  recentReviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentReviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  recentReviewAuthorName: {
    fontSize: typography.sizes.xs,
  },
  recentReviewDate: {
    fontSize: typography.sizes.xs,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  loadMoreText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
});
