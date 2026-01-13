import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
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
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.sm + 4,
    fontSize: typography.sizes.base,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: spacing.sm,
    marginTop: spacing.md + 4,
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  webInfoCard: {
    position: 'absolute',
    bottom: spacing.md + 4,
    left: spacing.md + 4,
    right: spacing.md + 4,
    padding: spacing.sm + 4,
    borderRadius: spacing.sm,
    ...getShadowStyle({
      color: '#000',
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
    padding: spacing.sm + 4,
    borderRadius: spacing.sm,
    ...getShadowStyle({
      color: '#000',
      offsetY: 2,
      opacity: 0.25,
      radius: 3.84,
      elevation: 5,
    }),
  },
  infoText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
});
