import { StyleSheet } from 'react-native';
import { spacing, typography, shadows } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: '100%',
    maxWidth: 860,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    ...shadows.lg,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.base,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: spacing.md,
  },
  button: {
    flex: 1,
  },
  comingSoon: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    overflow: 'hidden',
  },
});

export default styles;
