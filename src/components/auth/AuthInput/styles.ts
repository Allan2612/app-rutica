import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

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
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.sm,
    width: '100%',
  },
});
