import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  badgeText: {
    fontWeight: typography.fontWeights.semibold,
  },

  // Sizes
  size_sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  size_md: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  text_sm: {
    fontSize: typography.sizes.xs - 1,
  },
  text_md: {
    fontSize: typography.sizes.xs,
  },

  // Status colors
  badge_pending: {
    backgroundColor: colors.primary[50],
  },
  badge_approved: {
    backgroundColor: colors.primary[50],
  },
  badge_rejected: {
    backgroundColor: colors.primary[50],
  },
});
