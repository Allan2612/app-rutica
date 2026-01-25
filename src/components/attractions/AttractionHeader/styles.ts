import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: spacing.lg,
    },
    categoryText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.xs,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    ratingText: {
        fontSize: typography.sizes.sm,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    locationText: {
        fontSize: typography.sizes.sm,
        flex: 1,
    },
    descriptionSection: {
        marginTop: spacing.xs,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.sm,
    },
    descriptionText: {
        fontSize: typography.sizes.base,
        lineHeight: 24,
    },
    readMoreText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
        marginTop: spacing.xs,
    },
});
