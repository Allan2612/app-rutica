import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    marginVertical: spacing.sm + 4,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  content: {
    gap: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
});
