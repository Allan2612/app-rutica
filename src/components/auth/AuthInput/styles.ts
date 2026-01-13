import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md + 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    width: '100%',
  },
});
