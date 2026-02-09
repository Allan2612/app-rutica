import { StyleSheet, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    zIndex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 56,
    height: 56,
  },
  brandTextContainer: {
    marginLeft: spacing.md,
  },
  brandName: {
    fontSize: 36,
    lineHeight: 40,
  },
  brandTagline: {
    fontSize: typography.sizes.sm,
    marginTop: -4,
  },
  greetingContainer: {
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.sizes.base,
    marginBottom: spacing.xs,
  },
  welcomeMessage: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  welcomeMessageMobile: {
    fontSize: typography.sizes.xl,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: spacing.lg,
  },
  statsContainerMobile: {
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
});
