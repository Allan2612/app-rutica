import { StyleSheet } from 'react-native';
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
        minWidth: 100,
        borderRadius: 16,
        borderWidth: 1,
        padding: spacing.lg,
        alignItems: 'center',
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
    },
    summaryLabel: {
        fontSize: typography.sizes.xs,
        textAlign: 'center',
    },
    highlightCard: {
        width: '100%',
        maxWidth: 600,
        borderRadius: 16,
        borderWidth: 2,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },
    highlightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    highlightTitle: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.semibold,
    },
    highlightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    highlightLogo: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    highlightInfo: {
        flex: 1,
    },
    highlightName: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
        marginBottom: spacing.xs,
    },
    highlightStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    highlightCount: {
        fontSize: typography.sizes.sm,
    },
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
    chartIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
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
    chartContainer: {
        alignItems: 'center',
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        overflow: 'hidden',
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
    listSection: {
        width: '100%',
        maxWidth: 600,
        marginTop: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.semibold,
        marginBottom: spacing.md,
    },
    contactTypesList: {
        gap: spacing.sm,
    },
    contactTypeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        padding: spacing.md,
        gap: spacing.md,
    },
    contactTypeIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactTypeInfo: {
        flex: 1,
    },
    contactTypeName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.fontWeights.medium,
    },
    contactTypeCount: {
        alignItems: 'flex-end',
    },
    contactTypeValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.fontWeights.bold,
    },
    contactTypeLabel: {
        fontSize: typography.sizes.xs,
    },
    emptyCard: {
        width: '100%',
        maxWidth: 600,
        borderRadius: 16,
        borderWidth: 1,
        padding: spacing.xl,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.sizes.base,
        fontWeight: typography.fontWeights.medium,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    emptyDesc: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        gap: 6,
        minHeight: 36,
        flex: 1,
        maxWidth: '48%',
    },
    filterToggleText: {
        fontSize: 11,
        fontWeight: '600',
    },
});
