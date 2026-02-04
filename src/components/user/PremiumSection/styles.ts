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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
    },
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.sm,
    },
    badgeText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },
    content: {
        gap: spacing.md,
    },
    subscriptionCard: {
        borderRadius: spacing.md,
        padding: spacing.md,
        gap: spacing.sm,
    },
    subscriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subscriptionName: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    subscriptionPrice: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.bold,
    },
    subscriptionDate: {
        fontSize: typography.sizes.xs,
    },
    featuresList: {
        gap: spacing.xs,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    featureText: {
        fontSize: typography.sizes.sm,
        flex: 1,
    },
    noSubscription: {
        alignItems: 'center',
        padding: spacing.lg,
        gap: spacing.md,
    },
    noSubscriptionIcon: {
        marginBottom: spacing.sm,
    },
    noSubscriptionTitle: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        textAlign: 'center',
    },
    noSubscriptionText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
    subscribeButton: {
        paddingVertical: spacing.sm + 4,
        paddingHorizontal: spacing.xl,
        borderRadius: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
    },
    subscribeButtonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        color: '#ffffff',
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: spacing.sm,
        borderWidth: 2,
        marginTop: spacing.md,
    },
    addMoreButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: spacing.lg,
    },
});
