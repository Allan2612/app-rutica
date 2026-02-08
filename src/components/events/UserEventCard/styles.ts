import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.md,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: spacing.xs,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    titleContainer: {
        flex: 1,
    },
    name: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
        lineHeight: 20,
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    categoryChip: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: typography.fontWeights.medium,
    },
    statusBadgeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: 2,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    infoText: {
        fontSize: typography.sizes.xs,
        lineHeight: 16,
        flex: 1,
    },
    price: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    capacity: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    description: {
        fontSize: typography.sizes.sm,
        lineHeight: 18,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        gap: spacing.sm,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: 6,
        gap: spacing.xs,
    },
    actionText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
});
