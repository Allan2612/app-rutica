import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  icon: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: '#ffffff',
  },
});
