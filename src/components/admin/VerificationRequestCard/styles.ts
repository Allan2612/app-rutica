import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.md - 4,
    borderWidth: 1,
    marginBottom: spacing.md - 4,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.md - 4,
    gap: spacing.md - 4,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: spacing.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.base - 1,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.sizes.base + 4,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  typeText: {
    fontSize: typography.sizes.xs - 1,
    fontWeight: typography.fontWeights.medium,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm + 5,
    marginTop: spacing.xs - 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaText: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs + 4,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  ownerText: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs + 4,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md - 4,
    borderRadius: spacing.sm,
    borderWidth: 1.5,
    gap: spacing.xs + 2,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs + 2,
  },
  inactiveBadge: {
    width: spacing.sm + spacing.sm + 2,
    height: spacing.sm + spacing.sm + 2,
    borderRadius: spacing.sm + 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
