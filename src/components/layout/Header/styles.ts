import { StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';
import { getShadowStyle } from '../../../utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[600],
    letterSpacing: -0.5,
  },
  userButton: {
    padding: 4,
  },
  userIconAuthenticated: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconGuest: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // User Menu
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
    padding: 16,
    gap: 12,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  menuUserEmail: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: colors.text.primary,
  },
  menuItemTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary[600],
  },
  menuItemDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemTextDanger: {
    fontSize: 15,
    color: '#ef4444',
  },
});
