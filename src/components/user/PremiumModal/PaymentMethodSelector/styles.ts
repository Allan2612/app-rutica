import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  paymentMethodSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  paymentMethodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 10,
  },
  paymentMethodButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
