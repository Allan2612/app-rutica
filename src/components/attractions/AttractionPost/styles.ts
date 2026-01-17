import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    post: {
        backgroundColor: colors.background.primary,
        borderRadius: spacing.md,
        borderWidth: 1,
        borderColor: colors.border.medium,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.bold,
        color: colors.primary[700],
    },
    headerInfo: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    authorName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    metaText: {
        fontSize: typography.sizes.xs,
        marginTop: 2,
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    imagePlaceholder: {
        width: '100%',
        aspectRatio: 16 / 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: spacing.sm,
        left: 0,
        right: 0,
        gap: spacing.xs,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
    },
    title: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginTop: spacing.sm,
    },
    categoryChip: {
        borderRadius: spacing.sm + 4,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs,
    },
    categoryText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    footerText: {
        marginLeft: spacing.xs,
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    locationText: {
        marginLeft: spacing.xs,
        fontSize: typography.sizes.xs,
    },
});
