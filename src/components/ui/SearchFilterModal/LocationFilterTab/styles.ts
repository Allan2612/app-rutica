import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  currentLocationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    borderWidth: 1,
  },
  searchButtonText: {
    flex: 1,
    fontSize: typography.sizes.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: spacing.xs,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  listItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.xs,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  listItemText: {
    fontSize: 15,
    fontWeight: typography.fontWeights.medium,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: spacing.xs,
  },
  messageTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  messageText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
});
