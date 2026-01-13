import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary[500],
    ...getShadowStyle({
      color: colors.primary[500],
      offsetX: 0,
      offsetY: 6,
      opacity: 0.25,
      radius: 12,
      elevation: 6,
    }),
  },
  secondary: {
    borderWidth: 2,
    borderColor: colors.border.medium,
    backgroundColor: colors.background.secondary,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
  primaryText: {
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.secondary,
  },
});
