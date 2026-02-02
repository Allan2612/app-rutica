import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        gap: spacing.sm + 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: typography.sizes.xs - 1,
        fontWeight: typography.fontWeights.semibold,
        textTransform: 'uppercase',
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    ratingText: {
        fontSize: typography.sizes.xs + 1,
        fontWeight: typography.fontWeights.semibold,
        marginLeft: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentTitle: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        lineHeight: 22,
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
        borderRadius: 8,
        marginTop: 2,
    },
    commentText: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
        fontStyle: 'italic',
    },
});
