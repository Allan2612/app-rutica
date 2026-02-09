import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  sectionNoTitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: typography.sizes.base,
    lineHeight: 24,
  },
  readMoreText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginTop: spacing.xs,
  },
});
