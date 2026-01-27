import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#fbbf24', // Amarillo vibrante
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  large: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  text: {
    color: '#000000',
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.3,
  },
  text_small: {
    fontSize: 10,
  },
  text_medium: {
    fontSize: 11,
  },
  text_large: {
    fontSize: 12,
  },
});
