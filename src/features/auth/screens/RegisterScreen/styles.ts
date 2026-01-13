import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: spacing.md + 4,
    width: '100%',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
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
    borderColor: colors.border.medium,
    borderRadius: spacing.sm + 4,
    padding: spacing.lg - 6,
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
  },
  roleButtonActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  roleTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  roleTextActive: {
    color: colors.primary[700],
  },
  roleSubtitle: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
