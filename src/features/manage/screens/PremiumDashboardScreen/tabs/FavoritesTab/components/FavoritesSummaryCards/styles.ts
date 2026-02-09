import { StyleSheet, Platform } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        width: '100%',
        maxWidth: 600,
        marginBottom: spacing.xl,
    },
    summaryCard: {
        flex: 1,
        minWidth: Platform.select({ web: 100, default: 250 }),
        borderRadius: 16,
        borderWidth: 1,
        padding: spacing.lg,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.sm,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        alignSelf: 'stretch',
    },
    summaryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    summaryValue: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.xs,
        minHeight: 48,
    },
    summaryLabel: {
        fontSize: typography.sizes.xs,
        textAlign: 'center',
    },
});
