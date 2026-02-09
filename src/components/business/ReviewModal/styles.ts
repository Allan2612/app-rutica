import { StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  closeButton: {
    padding: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.lg,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  businessLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  businessDetails: {
    flex: 1,
  },
  businessName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  businessType: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  ratingSection: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.xs,
  },
  optional: {
    fontWeight: typography.fontWeights.normal,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  starButton: {
    padding: 4,
  },
  commentSection: {
    marginBottom: spacing.lg,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.sizes.sm,
    minHeight: 100,
  },
  charCount: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {},
  buttonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
});
