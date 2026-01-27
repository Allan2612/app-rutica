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
    badgeContainer: {
        position: 'absolute',
        top: spacing.sm + 4,
        left: spacing.sm + 4,
        zIndex: 10,
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
        paddingBottom: spacing.md + 4,
        paddingTop: spacing.lg,
        zIndex: 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    infoColumn: {
        flex: 1,
        gap: 4,
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
        flexDirection: 'column',
        gap: spacing.sm,
    },
    actionButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    editButton: {
        backgroundColor: '#FFFFFF',
    },
    deleteButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.95)',
    },
});
