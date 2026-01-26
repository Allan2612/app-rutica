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
    priceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: 12,
    },
    priceInfo: {
        gap: 2,
    },
    priceLabel: {
        fontSize: typography.sizes.xs,
    },
    priceValue: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.bold,
    },
    sinpeCard: {
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        gap: spacing.md,
    },
    sinpeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    sinpeTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.semibold,
    },
    sinpeDetails: {
        gap: spacing.xs,
    },
    sinpeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sinpeLabel: {
        fontSize: typography.sizes.sm,
    },
    sinpeValue: {
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
    noticeCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: 12,
    },
    noticeText: {
        flex: 1,
        fontSize: typography.sizes.xs,
        lineHeight: 18,
    },
});
