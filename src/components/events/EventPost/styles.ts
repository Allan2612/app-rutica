import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  post: {
    backgroundColor: colors.background.primary,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary[700],
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: spacing.sm,
  },
  ratingText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  authorName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  metaText: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    marginTop: spacing.xs + 1,
    gap: spacing.xs,
  },
  eventInfoText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  priceText: {
    fontWeight: typography.fontWeights.semibold,
  },
  description: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  categoryChip: {
    borderRadius: spacing.sm + 4,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  contactSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    width: '48%',
    minWidth: 140,
  },
  contactText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  // Actions bar (Me gusta, Comentar, Compartir)
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  // Reviews section styles (legacy)
  reviewsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  reviewsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reviewsToggleText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  writeReviewButton: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.sm,
  },
  writeReviewButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.inverse,
  },
  reviewsList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
  },
  reviewItem: {
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  reviewInfo: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  reviewAuthor: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewDate: {
    fontSize: typography.sizes.xs,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  reviewActionButton: {
    padding: spacing.xs,
  },
  reviewComment: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  reviewLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  reviewLikeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  emptyReviewsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  emptyReviewsText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  writeReviewButtonLarge: {
    paddingHorizontal: spacing.md + spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.sm,
  },
  writeReviewButtonLargeText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
});
