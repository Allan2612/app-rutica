import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  input: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  unitBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  unitText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.xs,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
});
