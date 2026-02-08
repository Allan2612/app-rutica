import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    // ── Full-size variant (listing screens) ──
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.md,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        borderLeftWidth: 3,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    iconWrapper: {
        width: 30,
        height: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.bold,
    },
    countBadge: {
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 3,
        borderRadius: 999,
    },
    countText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },

    // ── Compact variant (home featured horizontal sections) ──
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm + 4,
        paddingBottom: spacing.xs,
        gap: 6,
    },
    compactIconWrapper: {
        width: 22,
        height: 22,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compactTitle: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },
    compactCount: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.medium,
    },
});
