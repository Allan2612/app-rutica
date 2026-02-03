import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    card: {
        padding: spacing.md,
        borderRadius: spacing.md - 4,
        borderWidth: 1,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
    },
    image: {
        width: 72,
        height: 72,
        borderRadius: spacing.sm,
    },
    imagePlaceholder: {
        width: 72,
        height: 72,
        borderRadius: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainInfo: {
        flex: 1,
        gap: spacing.xs + 2,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.xs,
    },
    productName: {
        flex: 1,
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
        lineHeight: typography.sizes.lg + 6,
    },
    statusBadge: {
        width: spacing.lg,
        height: spacing.lg,
        borderRadius: spacing.md - 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    businessRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    businessText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    ownerText: {
        fontSize: typography.sizes.sm,
    },
    divider: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.bold,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    infoValue: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    dateText: {
        fontSize: typography.sizes.xs,
        marginLeft: 'auto',
    },
    description: {
        fontSize: typography.sizes.sm,
        lineHeight: typography.sizes.sm + 6,
        padding: spacing.sm,
        borderRadius: spacing.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.sm,
        borderRadius: spacing.sm,
        borderWidth: 1.5,
        gap: spacing.xs + 2,
        minHeight: spacing.xl + spacing.sm,
    },
    actionButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
});
