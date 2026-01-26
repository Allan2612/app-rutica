/**
 * Estilos para PromotionPublicCard
 * Diseño atractivo con énfasis en el descuento
 */

import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    card: {
        borderRadius: spacing.md,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: spacing.md,
        flex: 1,
        minHeight: 280,
        justifyContent: 'flex-end',
        elevation: 2,
    },
    heroFull: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountBadge: {
        position: 'absolute',
        top: spacing.sm + 4,
        left: spacing.sm + 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm + 4,
        paddingVertical: spacing.xs + 4,
        backgroundColor: '#fbbf24', // Amarillo vibrante
        borderRadius: 14,
        elevation: 4,
        zIndex: 10,
    },
    discountText: {
        color: '#000000',
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
        letterSpacing: -0.5,
    },
    discountLabel: {
        color: '#000000',
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.bold,
        marginLeft: 2,
    },
    urgencyBadge: {
        position: 'absolute',
        top: spacing.sm + 4,
        right: spacing.sm + 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs + 2,
        borderRadius: 12,
        elevation: 3,
        zIndex: 10,
    },
    urgencyText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.bold,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 4,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        zIndex: 8,
        gap: spacing.xs,
    },
    title: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
        color: '#FFFFFF',
        lineHeight: 22,
    },
    businessRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    businessName: {
        fontSize: typography.sizes.sm,
        color: 'rgba(255,255,255,0.9)',
        flex: 1,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    dateText: {
        fontSize: typography.sizes.xs,
        color: 'rgba(255,255,255,0.8)',
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: spacing.xs,
        marginTop: spacing.xs,
        overflow: 'hidden',
    },
    categoryChip: {
        borderRadius: spacing.sm + 4,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs,
    },
    categoryText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },
});
