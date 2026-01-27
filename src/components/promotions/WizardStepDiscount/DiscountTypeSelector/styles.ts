import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
  },
  label: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
});
