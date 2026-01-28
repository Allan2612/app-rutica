import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    card: {
        borderRadius: spacing.lg,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    imageContainer: {
        height: 180,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    placeholderText: {
        fontSize: typography.sizes.xs,
    },
    badgeContainer: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
    },
    scopeBadge: {
        position: 'absolute',
        bottom: spacing.md,
        left: spacing.md,
        paddingHorizontal: 10,
        paddingVertical: spacing.xs,
        borderRadius: 6,
    },
    scopeText: {
        color: colors.text.inverse,
        fontSize: 11,
        fontWeight: typography.fontWeights.medium,
    },
    content: {
        padding: spacing.lg,
        gap: spacing.sm,
    },
    title: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        lineHeight: 24,
    },
    description: {
        fontSize: typography.sizes.sm,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    metaText: {
        fontSize: typography.sizes.xs,
        flex: 1,
    },
    categoriesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.xs,
    },
    categoriesText: {
        fontSize: 11,
    },
    previewLabel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingVertical: spacing.xs,
        alignItems: 'center',
    },
    previewLabelText: {
        fontSize: 10,
        fontWeight: typography.fontWeights.semibold,
        letterSpacing: 1,
    },
    // Compact styles
    compactCard: {
        flexDirection: 'row',
        borderRadius: spacing.md,
        borderWidth: 1,
        overflow: 'hidden',
        height: 70,
    },
    compactImageContainer: {
        width: 70,
        height: 70,
        position: 'relative',
    },
    compactImage: {
        width: '100%',
        height: '100%',
    },
    compactPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    compactInfo: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        gap: 2,
    },
    compactTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    compactBusiness: {
        fontSize: typography.sizes.xs,
    },
});
