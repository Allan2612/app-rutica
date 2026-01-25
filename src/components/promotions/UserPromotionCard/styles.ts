import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

/**
 * Estilos para UserPromotionCard
 * Basado en el diseño de BusinessCard con full-size image y overlay
 */
export const styles = StyleSheet.create({
    card: {
        borderRadius: spacing.md,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: spacing.md,
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
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs + 2,
        borderRadius: 14,
        elevation: 3,
        zIndex: 10,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.bold,
    },
    topRightBadges: {
        position: 'absolute',
        top: spacing.sm + 4,
        right: spacing.sm + 4,
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: spacing.xs,
        zIndex: 10,
    },
    paymentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs - 2,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.xs + 2,
        borderRadius: 14,
        borderWidth: 1,
        elevation: 3,
    },
    paymentText: {
        fontSize: 10,
        fontWeight: typography.fontWeights.semibold,
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
        gap: spacing.sm,
    },
    titleSection: {
        gap: 2,
    },
    title: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.bold,
        color: '#FFFFFF',
    },
    businessName: {
        fontSize: typography.sizes.xs,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    dateText: {
        fontSize: typography.sizes.xs,
        color: 'rgba(255,255,255,0.9)',
    },
    expiredBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: spacing.sm,
        marginLeft: spacing.xs,
    },
    expiredText: {
        fontSize: 10,
        fontWeight: typography.fontWeights.semibold,
        color: '#FFFFFF',
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
});
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
