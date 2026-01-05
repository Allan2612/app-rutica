import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
  },

  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyStateText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
