import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },

  listItemNested: {
    paddingLeft: spacing.xl,
    backgroundColor: colors.background.secondary,
  },

  listItemNestedDeep: {
    paddingLeft: spacing['2xl'],
    backgroundColor: colors.background.tertiary,
  },

  listItemSelected: {
    backgroundColor: colors.primary[50],
  },

  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },

  listItemText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeights.medium,
    flex: 1,
  },

  listItemTextNested: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.normal,
  },

  listItemTextNestedDeep: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.normal,
    color: colors.text.secondary,
  },

  listItemTextSelected: {
    color: colors.primary[700],
    fontWeight: typography.fontWeights.semibold,
  },
});
