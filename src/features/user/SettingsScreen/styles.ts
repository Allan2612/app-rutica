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
  header: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.fontWeights.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.base,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.fontWeights.medium,
  },
  settingDescription: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
  },
});

export default styles;
