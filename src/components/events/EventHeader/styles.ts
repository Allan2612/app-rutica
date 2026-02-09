import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
  },
  infoSection: {
    flex: 1,
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  name: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  verificationIcon: {
    width: 24,
    height: 24,
    marginBottom: spacing.sm,
  },
  descriptionContainer: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  description: {
    fontSize: typography.sizes.base,
    lineHeight: 24,
    opacity: 0.9,
    textAlign: 'center',
  },
  readMoreText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginTop: spacing.xs,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    justifyContent: 'center',
  },
  infoPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  infoPillText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  authorText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
