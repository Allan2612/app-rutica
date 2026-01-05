import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    padding: spacing.xs,
  },

  closeIcon: {
    color: colors.text.primary,
  },

  searchInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.sm,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text.primary,
    marginTop: spacing.sm,
  },

  placeholder: {
    color: colors.text.tertiary,
  },
});
