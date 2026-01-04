import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontWeight: '600',
  },

  // Sizes
  size_sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  size_md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text_sm: {
    fontSize: 11,
  },
  text_md: {
    fontSize: 12,
  },

  // Status colors
  badge_pending: {
    backgroundColor: '#FEF3C7',
  },
  badge_approved: {
    backgroundColor: '#ECFDF5',
  },
  badge_rejected: {
    backgroundColor: '#FEE2E2',
  },
});
