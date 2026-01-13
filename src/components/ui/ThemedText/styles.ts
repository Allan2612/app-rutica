import { StyleSheet } from 'react-native';
import { colors, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  default: {
    fontSize: typography.sizes.base,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: typography.sizes.base,
    lineHeight: 24,
    fontWeight: typography.fontWeights.semibold,
  },
  title: {
    fontSize: typography.sizes['4xl'] - 4,
    fontWeight: typography.fontWeights.bold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
  link: {
    lineHeight: 30,
    fontSize: typography.sizes.base,
    color: colors.light.tint,
  },
});
