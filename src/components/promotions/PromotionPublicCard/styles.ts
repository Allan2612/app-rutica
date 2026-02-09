/**
 * Estilos para PromotionPublicCard
 * Diseño atractivo con énfasis en el descuento
 */

import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    minHeight: 280,
    justifyContent: 'flex-end',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroFull: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 10,
  },
  urgencyBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    elevation: 3,
    zIndex: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  urgencyText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 4,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    zIndex: 8,
    gap: spacing.xs - 2,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.inverse,
    lineHeight: 20,
    marginBottom: 2,
  },
  description: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.85)',
  },
  businessCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
    flexWrap: 'wrap',
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  businessName: {
    fontSize: typography.sizes.xs + 1,
    color: 'rgba(255,255,255,0.9)',
    flexShrink: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  dateText: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs - 2,
    overflow: 'hidden',
  },
  categoryChip: {
    borderRadius: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 1,
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
});
