import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  price: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  date: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  featuresList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    flex: 1,
  },
  reference: {
    fontSize: 13,
    marginTop: 4,
  },
});
