import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.fontWeights.medium,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.fontWeights.medium,
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: spacing.md - 2,
    fontSize: typography.sizes.sm + 1,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.fontWeights.medium,
  },
});
