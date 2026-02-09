import { StyleSheet } from 'react-native';
import { typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
  },
  connector: {
    width: 32,
    height: 2,
    borderRadius: 1,
  },
});
