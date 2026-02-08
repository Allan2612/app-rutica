import { StyleSheet } from 'react-native';
import { spacing } from '@/styles/theme';

export const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    gap: spacing.sm,
  },
  toggleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleStatus: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  helperText: {
    fontSize: 12,
    marginTop: 2,
  },
});
