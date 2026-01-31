import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xl,
    },
    modalContent: {
        width: '100%',
        maxWidth: 600,
        height: '85%',
        maxHeight: 700,
        borderRadius: spacing.md,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        borderBottomWidth: 1,
    },
    title: {
        flex: 1,
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
        marginRight: spacing.sm,
    },
    closeButton: {
        padding: spacing.xs,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.md,
    },
    emptyText: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        marginBottom: spacing.md,
        lineHeight: 20,
    },
    writeButton: {
        paddingHorizontal: spacing.md + spacing.sm,
        paddingVertical: spacing.sm + 2,
        borderRadius: spacing.sm,
    },
    writeButtonText: {
        color: colors.text.inverse,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    writeButtonOutline: {
        borderWidth: 1.5,
        borderRadius: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    writeButtonOutlineText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    reviewItem: {
        padding: spacing.sm,
        borderRadius: spacing.sm,
        marginBottom: spacing.sm,
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
});
