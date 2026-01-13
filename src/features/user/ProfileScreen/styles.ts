import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export default StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  contentContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 600,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['3xl'] - 2,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md + 4,
    backgroundColor: colors.background.tertiary,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
