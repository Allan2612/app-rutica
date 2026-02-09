import { StyleSheet } from 'react-native';
import { typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  column: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginBottom: 8,
  },
  error: {
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
});
