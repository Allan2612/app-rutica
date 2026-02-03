import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 32,
        alignItems: 'center',
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 1200,
    },
    header: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        marginBottom: spacing.lg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 4,
    },
    headerContent: {
        flex: 1,
        gap: 2,
    },
    headerTitle: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
    },
    headerSubtitle: {
        fontSize: typography.sizes.sm,
        lineHeight: 18,
    },
    statsContainer: {
        marginBottom: spacing.lg,
    },
    filtersContainer: {
        marginBottom: spacing.lg,
    },
    listContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl * 2,
        gap: spacing.md,
    },
    loadingText: {
        fontSize: typography.sizes.base,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl * 2,
        gap: spacing.md,
    },
    errorText: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
    },
    retryButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 8,
    },
    retryButtonText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xl * 2,
        gap: spacing.sm,
    },
    emptyTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.semibold,
    },
    emptyDescription: {
        fontSize: typography.sizes.base,
        textAlign: 'center',
        maxWidth: 300,
    },
    productsList: {
        gap: spacing.md,
    },
});
