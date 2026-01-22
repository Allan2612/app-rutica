import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    marginVertical: spacing.sm + 4,
    borderWidth: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
  },
  content: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: typography.sizes.base,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
    marginTop: spacing.xl,
  },
  backButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    textAlign: 'center',
  },
  editButton: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default styles;
