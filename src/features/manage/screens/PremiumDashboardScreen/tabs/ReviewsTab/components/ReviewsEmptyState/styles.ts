import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    emptyCard: {
        width: '100%',
        maxWidth: 600,
        borderRadius: 16,
        borderWidth: 1,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    emptyTitle: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    emptyDesc: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
});
