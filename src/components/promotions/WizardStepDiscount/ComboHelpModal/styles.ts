import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';
import { colors } from '@/styles/theme/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.fontWeights.bold,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  introText: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  exampleCard: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  exampleHeader: {
    marginBottom: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  badgeText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  exampleTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.bold,
  },
  stepsList: {
    gap: spacing.sm,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  stepText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.md,
    borderWidth: 1,
  },
  resultText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
    borderWidth: 1,
  },
  noteText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    lineHeight: 18,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  closeButtonLarge: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
});
