import { StyleSheet } from 'react-native';
import { spacing, typography, colors } from '@/styles/theme';

export const styles = StyleSheet.create({
    header: {
        marginBottom: spacing.md,
    },
    infoSection: {
        flex: 1,
        alignItems: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    name: {
        fontSize: typography.sizes['3xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.sm,
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    verificationIcon: {
        width: 24,
        height: 24,
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: typography.sizes.base,
        lineHeight: 24,
        marginBottom: spacing.lg,
        opacity: 0.9,
        textAlign: 'center',
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.md,
        justifyContent: 'center',
    },
    categoryChip: {
        paddingHorizontal: spacing.md + 2,
        paddingVertical: spacing.xs + 4,
        borderRadius: 24,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    categoryText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
        letterSpacing: 0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    locationText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
});
