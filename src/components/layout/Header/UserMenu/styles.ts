import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: spacing.md,
  },
  menuContainer: {
    borderRadius: spacing.sm + 4,
    minWidth: 240,
    ...getShadowStyle({
      color: '#000',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: 2,
  },
  menuUserEmail: {
    fontSize: typography.sizes.xs,
  },
  menuDivider: {
    height: 1,
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
  },
  menuItemTextPrimary: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
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
    color: '#ef4444',
    fontWeight: typography.fontWeights.medium,
  },
});
