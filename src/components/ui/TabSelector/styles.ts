import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  tab: {
    paddingVertical: spacing.sm + 4,
    position: 'relative',
  },
  tabText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: 0.2,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
