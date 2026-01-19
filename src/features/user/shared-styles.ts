import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.md,
  },
});

export default sharedStyles;
