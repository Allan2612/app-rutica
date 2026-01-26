import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.xs,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: 4,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    date: {
        fontSize: typography.sizes.sm,
    },
    comment: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
        marginTop: spacing.xs,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderRadius: 8,
    },
    editButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderRadius: 8,
    },
    deleteButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
});
