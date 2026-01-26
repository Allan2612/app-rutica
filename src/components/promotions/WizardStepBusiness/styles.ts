import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        // Se ajusta al contenido
    },
    content: {
        padding: spacing.md,
        gap: spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.md,
    },
    loadingText: {
        fontSize: typography.sizes.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
    businessScroll: {
        maxHeight: 250,
    },
    businessGrid: {
        gap: spacing.sm,
    },
    businessCard: {
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
    },
    businessCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    businessName: {
        flex: 1,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: spacing.xs,
    },
    errorText: {
        fontSize: typography.sizes.xs,
    },
    fieldError: {
        fontSize: typography.sizes.xs,
        marginTop: spacing.xs,
    },
    descriptionInput: {
        minHeight: 80,
    },
});
