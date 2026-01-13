import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    color: colors.text.secondary,
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeights.bold,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.text.primary,
  },
});
