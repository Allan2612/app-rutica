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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: 6,
  },
  compactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
  },
  compactHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  compactHintText: {
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.fontWeights.medium,
  },
});
