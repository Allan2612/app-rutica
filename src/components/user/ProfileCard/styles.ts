import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    marginVertical: spacing.sm + 4,
    borderWidth: 1,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  content: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
    alignItems: 'center',
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  value: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
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
    color: colors.text.inverse,
    textAlign: 'center',
  },
});

export default styles;
