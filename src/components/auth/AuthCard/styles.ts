import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    width: '100%',
    maxWidth: 480,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetX: 0,
      offsetY: 8,
      opacity: 0.1,
      radius: 24,
      elevation: 8,
    }),
  },
  title: {
    fontSize: typography.sizes['2xl'] + 2,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm + 4,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg + 4,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md + 4,
    paddingHorizontal: spacing.md,
    width: '100%',
    maxWidth: 480,
  },
});
