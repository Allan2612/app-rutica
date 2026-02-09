import { StyleSheet, Platform } from 'react-native';
import { spacing, typography, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: Platform.OS === 'web' ? '32%' : '48%',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 10,
  },
  imagesContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.background.tertiary,
  },
  imagesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  comboImage: {
    width: '33.33%',
    height: '100%',
  },
  comboImageHalf: {
    width: '50%',
  },
  comboImageFull: {
    width: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  productsContainer: {
    gap: 4,
    marginTop: spacing.xs,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quantityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
    backgroundColor: colors.primary[500],
  },
  quantityText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.2,
  },
  productName: {
    flex: 1,
    fontSize: typography.sizes.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  priceColumn: {
    flexDirection: 'column',
    gap: 2,
  },
  originalPrice: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    textDecorationLine: 'line-through',
  },
  priceLabel: {
    fontSize: typography.sizes.xs,
  },
  price: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  comboPrice: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
});
