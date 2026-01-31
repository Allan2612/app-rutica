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
    description: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs - 2,
        marginTop: spacing.xs + 2,
    },
    ratingText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    reviewCountText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.normal,
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
    // Estilos para barra de acciones estilo Facebook
    actionsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    actionButtonText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    // Estilos para sección de reseñas (legacy)
    reviewsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
    },
    reviewsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    reviewsToggleText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    writeReviewButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: 16,
    },
    writeReviewButtonText: {
        color: colors.text.inverse,
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },
    reviewsList: {
        borderTopWidth: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    emptyReviewsContainer: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        gap: spacing.md,
    },
    emptyReviewsText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        paddingHorizontal: spacing.md,
    },
    writeReviewButtonLarge: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        marginTop: spacing.xs,
    },
    writeReviewButtonLargeText: {
        color: colors.text.inverse,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    noReviewsText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        paddingVertical: spacing.md,
    },
    reviewItem: {
        padding: spacing.sm,
        borderRadius: spacing.sm,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    reviewAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewAvatarText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.bold,
    },
    reviewInfo: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    reviewAuthor: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    reviewMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: 2,
    },
    reviewStars: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewDate: {
        fontSize: typography.sizes.xs,
    },
    reviewActions: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    reviewActionButton: {
        padding: spacing.xs,
    },
    reviewComment: {
        fontSize: typography.sizes.sm,
        lineHeight: 18,
        marginTop: spacing.xs,
        marginLeft: 32 + spacing.sm,
    },
    reviewLikeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        marginTop: spacing.xs,
        marginLeft: 32 + spacing.sm,
    },
    reviewLikeText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
});
