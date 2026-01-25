import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
    maxWidth: 600,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  headerWithBack: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerContent: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 600,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes['3xl'] - 2,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.base,
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: '#ef4444',
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
});

export default styles;
