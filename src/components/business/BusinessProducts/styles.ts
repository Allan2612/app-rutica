import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        marginTop: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.lg,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    row: {
        justifyContent: 'flex-start',
        gap: spacing.sm,
    },
    loadingContainer: {
        paddingVertical: spacing['2xl'],
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: spacing['2xl'],
        alignItems: 'center',
        gap: spacing.md,
    },
    emptyText: {
        fontSize: typography.sizes.base,
        textAlign: 'center',
    },
});
