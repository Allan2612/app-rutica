import { StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/theme/colors';
import { spacing } from '../../../../../styles/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.sm,
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 6,
  },

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },

  locationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[600],
  },
});
