import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background.secondary,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: 22,
    marginBottom: spacing.xs - 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  businessName: {
    fontSize: typography.sizes.sm,
    flex: 1,
  },
  dateRange: {
    fontSize: typography.sizes.xs,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs - 2,
    marginTop: spacing.xs - 2,
  },
  categoryChip: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: spacing.xs,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
});
