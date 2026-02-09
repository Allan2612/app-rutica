import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  contentContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  mainContent: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    marginTop: spacing.md,
  },
  retryText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
});
