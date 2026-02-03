import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 600,
  },
  header: {
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    lineHeight: 22,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});
