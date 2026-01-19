import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.background.primary,
    marginBottom: spacing.sm + 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  imagePlaceholder: {
    backgroundColor: colors.border.medium,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm + 2,
    right: spacing.sm + 2,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.sm + 2,
  },
  badgeText: {
    color: colors.text.inverse,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.sizes.xs,
  },
  content: {
    position: 'absolute',
    left: spacing.sm + 4,
    right: spacing.sm + 4,
    bottom: spacing.sm + 4,
  },
  title: {
    color: colors.text.inverse,
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  business: {
    color: colors.text.tertiary,
    marginTop: 2,
    fontSize: typography.sizes.xs,
  },
  description: {
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    fontSize: typography.sizes.xs,
  },
});
