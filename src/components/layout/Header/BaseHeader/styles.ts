import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  logoText: {
    fontSize: typography.sizes['3xl'],
    letterSpacing: -0.5,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userButton: {
    padding: spacing.xs,
  },
  userIconAuthenticated: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconGuest: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});