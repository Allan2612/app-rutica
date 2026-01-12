import { StyleSheet } from 'react-native';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: '#10b981',
    ...getShadowStyle({
      color: '#10b981',
      offsetX: 0,
      offsetY: 6,
      opacity: 0.25,
      radius: 12,
      elevation: 6,
    }),
  },
  secondary: {
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#fafafa',
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#666',
  },
});
