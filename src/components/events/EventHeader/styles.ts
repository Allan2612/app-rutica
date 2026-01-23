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
        marginBottom: spacing.sm,
    },
    descriptionText: {
        fontSize: typography.sizes.base,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    infoText: {
        fontSize: typography.sizes.sm,
        flex: 1,
    },
    locationText: {
        fontSize: typography.sizes.sm,
        flex: 1,
    },
});
