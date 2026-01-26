import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
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
    section: {
        flex: 1,
    },
    businessScroll: {
        flex: 1,
    },
    businessGrid: {
        gap: spacing.sm,
    },
    businessCard: {
        borderRadius: 12,
        padding: spacing.md,
        borderWidth: 1,
        width: '100%',
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
