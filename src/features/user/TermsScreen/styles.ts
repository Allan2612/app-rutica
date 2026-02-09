import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  centerWrapper: {
    width: '100%',
    maxWidth: 600,
  },
  headerWithBack: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerContent: {
    flex: 1,
    marginRight: 40,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  card: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.bold,
    flex: 1,
  },
  paragraph: {
    fontSize: typography.sizes.sm,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  bulletList: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  bulletItem: {
    fontSize: typography.sizes.sm,
    lineHeight: 22,
    paddingLeft: spacing.xs,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1.5,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
  },
});

export default styles;
