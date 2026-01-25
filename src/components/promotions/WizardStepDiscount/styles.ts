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
    scopeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    scopeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        borderWidth: 1,
    },
    scopeLabel: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    discountTypeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    discountTypeCard: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 12,
        padding: spacing.md,
        alignItems: 'center',
        gap: spacing.sm,
    },
    discountTypeLabel: {
        flex: 1,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    inputWithUnit: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    discountInput: {
        flex: 1,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    unitBadge: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    unitText: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
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
    helperText: {
        fontSize: typography.sizes.xs,
        marginTop: spacing.xs,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    countBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: 10,
    },
    countText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.sm,
    },
    loadingText: {
        fontSize: typography.sizes.sm,
    },
    emptyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.sm,
    },
    emptyText: {
        fontSize: typography.sizes.sm,
    },
    productScroll: {
        maxHeight: 200,
    },
    productList: {
        gap: spacing.sm,
    },
    productCard: {
        borderRadius: 12,
        padding: spacing.md,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productName: {
        flex: 1,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    productPrice: {
        fontSize: typography.sizes.sm,
    },
});
