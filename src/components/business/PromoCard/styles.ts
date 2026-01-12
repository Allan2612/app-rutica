import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.dark.background,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 160,
  },
  imagePlaceholder: {
    backgroundColor: colors.border.medium,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    color: colors.text.inverse,
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  title: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '700',
  },
  business: {
    color: colors.dark.icon,
    marginTop: 2,
    fontSize: 13,
  },
  description: {
    color: colors.dark.icon,
    marginTop: 4,
    fontSize: 12,
  },
});
