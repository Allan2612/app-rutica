import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing['3xl'],
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    lineHeight: 20,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
    marginBottom: spacing.xs,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.sizes.base,
  },
  textArea: {
    minHeight: 100,
    paddingTop: spacing.sm + 2,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: typography.sizes.xs,
    color: '#ef4444',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  buttonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.semibold,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  loadingModal: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 200,
  },
  loadingCard: {
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.medium,
  },
});
