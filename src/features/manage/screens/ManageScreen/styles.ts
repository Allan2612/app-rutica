import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    elevation: 6,
  },
  title: {
    fontSize: typography.sizes['4xl'] - 4,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm + 4,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  comingSoon: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
