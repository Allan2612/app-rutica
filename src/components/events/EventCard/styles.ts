import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    overflow: 'hidden',
    boxShadow: '0px 6px 10px rgba(0,0,0,0.06)',
    elevation: 2,
    flex: 1,
    minHeight: 320,
    width: 280,
    justifyContent: 'flex-end',
  },
  heroFull: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
    zIndex: 10,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  ratingCount: {
    fontSize: 12,
    fontWeight: '500',
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
    paddingVertical: spacing.md,
    zIndex: 8,
    backgroundColor: 'transparent',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  priceContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
