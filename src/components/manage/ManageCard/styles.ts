import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    overflow: 'hidden',
    minHeight: 170,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  ctaRow: {
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  ctaText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
});

export default styles;
