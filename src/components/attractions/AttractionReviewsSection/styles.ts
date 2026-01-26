import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.lg,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    loadingContainer: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    emptyIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.xs,
    },
    emptyDescription: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    reviewsList: {
        gap: spacing.sm,
    },
    writeButton: {
        paddingVertical: spacing.sm + 4,
        paddingHorizontal: spacing.xl,
        borderRadius: 8,
    },
    writeButtonText: {
        color: '#fff',
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    writeButtonOutline: {
        paddingVertical: spacing.sm + 4,
        paddingHorizontal: spacing.xl,
        borderRadius: 8,
        borderWidth: 1.5,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    writeButtonOutlineText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
});
