import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.sm + 4,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: spacing.sm,
    marginTop: spacing.md + 4,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  webInfoCard: {
    position: 'absolute',
    bottom: spacing.md + 4,
    left: spacing.md + 4,
    right: spacing.md + 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: spacing.sm + 4,
    borderRadius: spacing.sm,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetY: 2,
      opacity: 0.25,
      radius: 3.84,
      elevation: 5,
    }),
  },
  mobileInfoCard: {
    position: 'absolute',
    top: spacing.sm + 2,
    left: spacing.sm + 2,
    right: spacing.sm + 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: spacing.sm + 4,
    borderRadius: spacing.sm,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetY: 2,
      opacity: 0.25,
      radius: 3.84,
      elevation: 5,
    }),
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
