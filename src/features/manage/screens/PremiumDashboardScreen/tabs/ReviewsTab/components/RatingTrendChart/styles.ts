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
});
