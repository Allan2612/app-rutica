import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: spacing.md + 4,
    width: '100%',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: spacing.sm + 4,
    padding: spacing.lg - 6,
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  roleTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.xs,
  },
  roleSubtitle: {
    fontSize: 11,
    textAlign: 'center',
  },
});
