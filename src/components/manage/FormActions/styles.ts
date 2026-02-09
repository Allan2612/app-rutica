import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm + spacing.xs, // 12
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + spacing.xs, // 20
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + spacing.xs + 2, // 14
    borderRadius: spacing.sm + 2, // 10
    gap: spacing.sm,
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
});
