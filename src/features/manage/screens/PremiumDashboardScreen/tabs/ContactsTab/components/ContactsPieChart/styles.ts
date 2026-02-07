import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/styles/theme';

export const styles = StyleSheet.create({
    chartCard: {
        width: '100%',
        maxWidth: 600,
        borderRadius: 20,
        borderWidth: 1,
        padding: spacing.xl,
        marginBottom: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    chartTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
        letterSpacing: -0.5,
    },
    chartSubtitle: {
        fontSize: typography.sizes.sm,
        marginBottom: spacing.xl,
        lineHeight: 20,
        opacity: 0.8,
    },
    pieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.md,
    },
    pieChartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieCenterValue: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
    },
    pieCenterLabel: {
        fontSize: typography.sizes.xs,
    },
    legendContainer: {
        flex: 1,
        marginLeft: spacing.lg,
        gap: spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendLabel: {
        flex: 1,
        fontSize: typography.sizes.xs,
    },
    legendValue: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.fontWeights.semibold,
    },
});
