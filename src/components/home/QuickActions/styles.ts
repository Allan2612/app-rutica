import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridMobile: {
    gap: spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
    borderWidth: 1,
  },
  actionCardMobile: {
    width: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.sm + 4,
  },
  actionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
});
