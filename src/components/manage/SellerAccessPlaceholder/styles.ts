import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    minHeight: 170,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    lineHeight: typography.sizes.xs * 1.4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.xs,
    marginTop: spacing.xs,
  },
  buttonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: '#fff',
  },
});

export default styles;
