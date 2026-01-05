import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';

export const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
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
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },

  listItemTextNested: {
    fontSize: 14,
    fontWeight: '400',
  },

  listItemTextNestedDeep: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text.secondary,
  },

  listItemTextSelected: {
    color: colors.primary[700],
    fontWeight: '600',
  },
});
