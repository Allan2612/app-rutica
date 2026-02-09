import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  toggleLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  clearAllButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: spacing.xs,
  },
  clearAllText: {
    fontSize: typography.sizes.sm - 1,
    fontWeight: typography.fontWeights.semibold,
  },
  generationsContainer: {
    flex: 1,
  },
  searchResults: {
    flex: 1,
  },
});
