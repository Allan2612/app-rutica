import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: spacing.md,
  },
  menuContainer: {
    backgroundColor: colors.background.primary,
    borderRadius: spacing.sm + 4,
    minWidth: 240,
    ...getShadowStyle({
      color: colors.dark.background,
      offsetX: 0,
      offsetY: 2,
      opacity: 0.25,
      radius: 8,
      elevation: 5,
    }),
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm + 4,
  },
  menuUserIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  menuUserEmail: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 4,
  },
  menuItemText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  menuItemTextPrimary: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary[600],
  },
  menuItemDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 4,
  },
  menuItemTextDanger: {
    fontSize: typography.sizes.sm,
    color: colors.error,
  },
});
