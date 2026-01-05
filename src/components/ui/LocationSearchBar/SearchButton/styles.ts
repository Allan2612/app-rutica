import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: spacing.md,
    padding: spacing.md,
    minHeight: 48,
  },

  searchButtonText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },

  locationButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: spacing.md,
  },

  icon: {
    color: colors.text.secondary,
  },

  locationIcon: {
    color: '#ffffff',
  },

  locationIconDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
