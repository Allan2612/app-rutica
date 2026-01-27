import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
import { colors } from '@/styles/theme/colors';

export const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginLeft: 'auto',
    marginTop: -4,
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
  helperText: {
    fontSize: typography.sizes.xs,
    marginBottom: 8,
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
    maxHeight: 350,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.sm,
  },
  productCard: {
    flexDirection: 'column',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    gap: spacing.sm,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quantityBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 6,
  },
  quantityBadgeText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  productName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    flex: 1,
  },
  productPrice: {
    fontSize: typography.sizes.sm,
  },
  quantitySection: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  quantityRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  quantityLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
    minWidth: 55,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quantityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  pillButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillNumber: {
    minWidth: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  pillNumberText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    minWidth: 48,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  quantityText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
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
  comboPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  comboPreviewLabel: {
    color: colors.text.inverse,
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    flex: 1,
  },
  comboPreviewValue: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
});
