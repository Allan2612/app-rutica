import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.xs + 2,
  },
  subtitle: {
    fontSize: typography.sizes.sm - 1,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
    marginBottom: spacing.md,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: 999,
  },
  hintText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },

  /* ── Compact variant (home sections) ────────────────── */
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  compactText: {
    flexShrink: 1,
    fontSize: typography.sizes.xs,
  },
});
