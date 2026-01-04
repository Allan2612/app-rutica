import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
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
