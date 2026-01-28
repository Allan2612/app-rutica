import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
import { colors } from '@/styles/theme/colors';

export const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.sizes.sm,
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
  },
  productScroll: {
    maxHeight: 300,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.sm,
  },
  productCard: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productName: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  productPrice: {
    fontSize: typography.sizes.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.xs,
  },
});
