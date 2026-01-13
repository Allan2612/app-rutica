import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
import { getShadowStyle } from '@/utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: spacing.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    width: '100%',
    maxWidth: 480,
    ...getShadowStyle({
      color: '#000',
      offsetX: 0,
      offsetY: 8,
      opacity: 0.1,
      radius: 24,
      elevation: 8,
    }),
  },
  title: {
    fontSize: typography.sizes['2xl'] + 2,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.sm + 4,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg + 4,
  },
  footer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md + 4,
    paddingHorizontal: spacing.md,
    width: '100%',
    maxWidth: 480,
  },
});
