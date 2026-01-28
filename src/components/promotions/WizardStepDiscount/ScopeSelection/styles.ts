import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  cardDescription: {
    fontSize: typography.sizes.xs,
    lineHeight: 16,
  },
});
