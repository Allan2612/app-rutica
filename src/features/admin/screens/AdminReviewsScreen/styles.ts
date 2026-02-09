import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 32,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 1200,
  },
  header: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  headerContent: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
    lineHeight: 26,
  },
  headerSubtitle: {
    fontSize: typography.sizes.xs + 1,
    lineHeight: 18,
  },
  statsContainer: {
    marginBottom: spacing.md,
  },
  filtersContainer: {
    marginBottom: spacing.md,
  },
  listContainer: {
    minHeight: 200,
    marginTop: spacing.md,
  },
  reviewsList: {
    gap: spacing.sm + 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  loadingText: {
    fontSize: typography.sizes.sm,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    gap: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.fontWeights.semibold,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    gap: spacing.sm + 4,
  },
  emptyTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
});
