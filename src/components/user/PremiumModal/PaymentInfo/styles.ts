import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sinpeCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  sinpeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sinpeTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sinpeDetails: {
    gap: 8,
  },
  sinpeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sinpeLabel: {
    fontSize: 13,
  },
  sinpeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
