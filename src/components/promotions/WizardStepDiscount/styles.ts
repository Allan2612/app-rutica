import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    // Se ajusta al contenido
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  // Legacy - keeping for backwards compatibility
  scopeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scopeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  scopeLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  // New scope grid layout
  scopeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  scopeCard: {
    width: '48%',
    minWidth: 140,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  scopeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scopeCardTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  scopeCardDescription: {
    fontSize: typography.sizes.xs,
    lineHeight: 16,
  },
  discountTypeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  discountTypeCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  discountTypeLabel: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  discountInput: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  unitBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  unitText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
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
  helperText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
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
  // Category selection styles
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChipLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  // Combo selection styles
  comboProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  comboProductInfo: {
    flex: 1,
    gap: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    minWidth: 24,
    textAlign: 'center',
  },
});
