import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  // Variante default
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.xs - 2,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.2,
  },

  // Variante small
  chipSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 10,
    borderWidth: 1,
    gap: spacing.xs - 2,
  },
  textSmall: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.2,
  },

  // Variante large
  chipLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: spacing.xs,
  },
  textLarge: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
});
