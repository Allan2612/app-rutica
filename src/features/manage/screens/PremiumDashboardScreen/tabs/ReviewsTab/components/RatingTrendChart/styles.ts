import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  chartCard: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: -0.5,
  },
  chartSubtitle: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.lg,
    lineHeight: 20,
    opacity: 0.8,
  },
  daysContainer: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  dayCard: {
    width: 100,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: spacing.xs,
  },
  dayIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  dayValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
  },
  dayCount: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
  },
  dayLabel: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    fontWeight: typography.fontWeights.medium,
  },
});
