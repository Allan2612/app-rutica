import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  tab: {
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    letterSpacing: 0.2,
  },
  tabTextActive: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.text.primary,
  },
});
