import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  roleButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  roleTextActive: {
    color: '#10b981',
  },
  roleSubtitle: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
