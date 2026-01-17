import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
        minHeight: 300,
    },
    emptyTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.bold,
        textAlign: 'center',
        marginBottom: spacing.xs + 2,
    },
    emptySubtitle: {
        fontSize: typography.sizes.xs,
        textAlign: 'center',
        lineHeight: 18,
    },
});
