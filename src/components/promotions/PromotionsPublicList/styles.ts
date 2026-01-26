/**
 * Estilos para PromotionsPublicList
 */

import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    listContent: {
        padding: spacing.md,
    },
    emptyList: {
        flexGrow: 1,
    },
    cardWrapper: {
        marginBottom: spacing.md,
    },
    columnWrapper: {
        justifyContent: 'flex-start',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing['2xl'],
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
});
