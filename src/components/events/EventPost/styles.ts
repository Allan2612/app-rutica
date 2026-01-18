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
    imagePlaceholder: {
        width: '100%',
        aspectRatio: 16 / 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
        flexWrap: 'wrap',
    },
    title: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
    },
    eventInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
        marginTop: spacing.xs + 1,
        gap: spacing.xs,
    },
    eventInfoText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    priceText: {
        fontWeight: typography.fontWeights.semibold,
    },
    description: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
        marginTop: spacing.xs,
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
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        gap: spacing.xs,
    },
    ratingText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    contactSection: {
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border.light,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        width: '48%',
        minWidth: 140,
    },
    contactText: {
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
    },
    footerText: {
        marginLeft: spacing.xs,
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
});
