import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        borderRadius: spacing.md - 4,
        borderWidth: 1,
        gap: spacing.sm + spacing.xs,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 2,
        flex: 1,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.xs + 2,
    },
    typeText: {
        fontSize: typography.sizes.xs - 1,
        fontWeight: typography.fontWeights.semibold,
        textTransform: 'uppercase',
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: spacing.xs - 2,
    },
    ratingText: {
        fontSize: typography.sizes.xs + 1,
        fontWeight: typography.fontWeights.semibold,
        marginLeft: spacing.xs,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    actionButton: {
        width: spacing.xl,
        height: spacing.xl,
        borderRadius: spacing.sm,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentTitle: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        lineHeight: typography.sizes.base + 6,
    },
    authorDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    authorText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    separator: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.bold,
    },
    dateText: {
        fontSize: typography.sizes.sm,
    },
    commentContainer: {
        padding: spacing.sm,
        borderRadius: spacing.sm,
        marginTop: spacing.xs - 2,
    },
    commentText: {
        fontSize: typography.sizes.sm,
        lineHeight: typography.sizes.sm + 7,
        fontStyle: 'italic',
    },
});
